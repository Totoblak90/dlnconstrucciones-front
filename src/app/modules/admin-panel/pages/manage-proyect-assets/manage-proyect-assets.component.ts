import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  alertFailureOrSuccessOnCRUDAction,
  noConnectionAlert,
  unknownErrorAlert,
} from 'src/app/helpers/alerts';
import { environment } from 'src/environments/environment';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import {
  OneProjectRes,
  Project,
  ProyectAssets,
} from '../../interfaces/users.interface';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-manage-proyect-assets',
  templateUrl: './manage-proyect-assets.component.html',
  styleUrls: ['./manage-proyect-assets.component.scss'],
})
export class ManageProyectAssetsComponent implements OnInit {
  public assets: ProyectAssets[] = [];
  public tableData: CuerpoTabla[] = [];
  public encabezadosTabla: string[] = [];
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public assetsForm!: FormGroup;
  public assetId!: number;
  public imageToShow: string = '../../../../../assets/no-image.png';
  public fileToUpload?: File | null;
  public acceptedFileTypes: boolean = true;
  public creationImageError: string = '';
  private projectID!: number;
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private projectsService: ProjectsService,
    private fb: FormBuilder,
    private adminPanelCrudService: AdminPanelCrudService
  ) {
    this.getprojectId();
    if (this.projectID) this.createForm();
    else this.router.navigateByUrl('/admin/proyectos');
  }

  public getprojectId(): void {
    this.projectID = this.router.getCurrentNavigation()?.extras?.state?.id;
  }

  private createForm(): void {
    this.assetsForm = this.fb.group({
      asset: [''],
    });
  }

  public showSelectedImage(e: any) {
    if (!this.assetsForm.controls.asset?.value) {
      this.creationImageError = 'El archivo es obligatorio';
      return;
    } else {
      this.creationImageError = '';
    }

    const file = e.target?.files[0];

    this.acceptedFileTypes =
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'video/mp4' ||
      file.type === 'video/avi' ||
      file.type === 'video/mov' ||
      file.type === 'video/wmv' ||
      file.type === 'video/mkv';

    if (file && this.acceptedFileTypes) {
      this.fileToUpload = file;
      if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => (this.imageToShow = reader.result as string);
      } else {
        this.imageToShow = '../../../../../assets/no-image-video.jpg';
      }
    } else {
      this.imageToShow = '../../../../../assets/no-image.png';
      this.fileToUpload = null;
    }
  }

  public formSubmit(): void {
    this.assetsForm.markAllAsTouched();

    if (!this.assetsForm.controls.asset?.value) {
      this.creationImageError = 'El archivo es obligatorio';
      return;
    } else {
      this.creationImageError = '';
    }

    if (this.assetsForm.valid) {
      const formData: FormData = new FormData();
      if (this.fileToUpload) {
        formData.append('asset', this.fileToUpload!);
        formData.append('projects_id', this.projectID.toString());
        this.crudAction === 'Crear'
          ? this.crearAssetEnLaDb(formData)
          : this.editarAssetEnLaDb(formData);
      }
    }
  }

  ngOnInit(): void {
    this.getAssets();
  }

  private getAssets(): void {
    this.projectsService
      .getOneProject(this.projectID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: OneProjectRes) => {
          if (res?.meta?.status.toString().includes('20')) {
            this.assets = res?.data?.Assets!;
            this.getProjectAssetsFiles();
          } else {
            unknownErrorAlert(res);
          }
        },
        (err) => noConnectionAlert(err)
      );
  }

  private getProjectAssetsFiles(): void {
    for (const asset of this.assets) {
      this.projectsService
        .getAssetsDeUnProyecto(asset.asset)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (blob) => {
            this.setTableData(blob, asset);
          },
          error: (err) => noConnectionAlert(err),
        });
    }
  }

  private setTableData(blob: Blob, asset: ProyectAssets): void {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      this.tableData.push({
        id: asset.id,
        imagen: reader.result as string,
        imagenEsArchivo: true,
        tipoDeArchivo: blob.type,
      });
    };
  }

  public recargarAssets(recargar: boolean): void {
    if (recargar) {
      this.resetsetControls();
      this.tableData = [];
      this.assets = [];
      this.isCreating = false;
      this.isEditing = false;
      this.fileToUpload = null;
      this.imageToShow = '../../../../../assets/no-image.png';
      this.getAssets();
    }
  }

  private resetsetControls(): void {
    this.assetsForm.controls.asset?.setValue('');
  }

  public crearAsset(): void {
    this.crudAction = 'Crear';
    this.isCreating = true;
    this.isEditing = false;
  }

  private crearAssetEnLaDb(payload: FormData): void {
    this.adminPanelCrudService
      .create(payload, 'assets')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarAssets(true);
          alertFailureOrSuccessOnCRUDAction(res, 'creó', 'archivo');
        },
        (err) => {
          this.recargarAssets(true);
          noConnectionAlert(err);
        }
      );
  }

  public editarAssets(assetId: number): void {
    this.crudAction = 'Editar';
    this.isEditing = true;
    this.isCreating = false;
    const asset: ProyectAssets | undefined = this.assets.find(
      (asset: ProyectAssets) => asset.id === assetId
    );
    asset ? (this.assetId = assetId) : null;
  }

  private editarAssetEnLaDb(payload: FormData): void {
    this.adminPanelCrudService
      .edit(this.assetId, payload, 'assets')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarAssets(true);
          alertFailureOrSuccessOnCRUDAction(res, 'editó', 'archivo');
        },
        (err) => {
          this.recargarAssets(true);
          noConnectionAlert(err);
        }
      );
  }

  public borrarAsset(assetId: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el archivo seleccionado?',
      showDenyButton: true,
      confirmButtonText: 'Si, borrar',
      denyButtonText: `No`,
    }).then((result: SweetAlertResult<any>) => {
      result.isConfirmed ? this.borrarAssetEnLaDb(assetId) : null;
    });
  }

  private borrarAssetEnLaDb(assetId: number): void {
    this.adminPanelCrudService
      .delete(assetId, 'assets')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarAssets(true);
          alertFailureOrSuccessOnCRUDAction(res, 'borró', 'archivo');
        },
        (err) => {
          this.recargarAssets(true);
          noConnectionAlert(err);
        }
      );
  }
}
