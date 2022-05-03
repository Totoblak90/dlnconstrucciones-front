import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  Host,
  HostBinding,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  alertFailureOrSuccessOnCRUDAction,
  customMessageAlert,
  noConnectionAlert,
  unknownErrorAlert,
} from 'src/app/helpers/alerts';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { OneProjectRes, ProyectAssets } from '../../interfaces/users.interface';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import { ProjectsService } from '../../services/projects.service';

interface imageToShowObj {
  path: string;
  type: string;
}

@Component({
  selector: 'app-manage-proyect-assets',
  templateUrl: './manage-proyect-assets.component.html',
  styleUrls: ['./manage-proyect-assets.component.scss'],
})
export class ManageProyectAssetsComponent implements OnInit {
  @HostBinding('class.admin-panel-container') someClass: Host = true;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  public assets: ProyectAssets[] = [];
  public tableData: CuerpoTabla[] = [];
  public encabezadosTabla: string[] = [];
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public assetsForm!: FormGroup;
  public assetId!: number;
  public imageToShow: imageToShowObj[] = [
    {
      path: '../../../../../assets/no-image.png',
      type: 'image/png',
    },
  ];
  public fileToUpload: File[] = [];
  public acceptedFileTypes: boolean = true;
  public creationImageError: string = '';
  private projectID!: number;
  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private router: Router,
    private projectsService: ProjectsService,
    private fb: FormBuilder,
    private adminPanelCrudService: AdminPanelCrudService,
    private location: Location
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

  public openInput(): void {
    this.imageInput.nativeElement.click();
  }

  public async showSelectedImage(e: any): Promise<void> {
    if (!this.assetsForm.controls.asset?.value) {
      this.creationImageError = 'El archivo es obligatorio';
      return;
    } else {
      this.creationImageError = '';
    }

    let files = Array.from(e.target?.files as FileList);

    files = await this.checkAmountOfFiles(files);

    this.acceptedFileTypes = await this.checkFilesType(files);

    if (files.length && this.acceptedFileTypes) {
      this.imageToShow = [];
      this.fileToUpload = files;
      files.forEach((file) => {
        // if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
          this.imageToShow.push({
            path: reader.result as string,
            type: file.type,
          });
      });
    } else {
      this.imageToShow = [
        {
          path: '../../../../../assets/no-image.png',
          type: 'image/png',
        },
      ];
      this.fileToUpload = [];
    }
  }

  private checkAmountOfFiles(files: File[]): Promise<File[]> {
    let filesHaveVideo: boolean = false;
    let acceptedLength: number = 10;
    files.forEach((file) => {
      file.type.includes('video') ? (filesHaveVideo = true) : null;
    });

    if (filesHaveVideo) {
      acceptedLength = 5;
    }
    return new Promise((resolve) => {
      if (files.length > acceptedLength) {
        customMessageAlert(
          'Atención',
          `No se pueden subir mas de ${acceptedLength} archivos`,
          'OK',
          'info'
        );
        files = files.slice(0, acceptedLength);
      }
      resolve(files);
    });
  }

  private checkFilesType(files: File[]): Promise<boolean> {
    return new Promise((resolve) => {
      let validator: boolean | 'valido' = 'valido';
      files.forEach((file) => {
        if (
          file.type.includes('image/jpg') ||
          file.type.includes('image/jpeg') ||
          file.type.includes('image/png') ||
          file.type.includes('video/mp4') ||
          file.type.includes('video/avi') ||
          file.type.includes('video/mov') ||
          file.type.includes('video/wmv') ||
          file.type.includes('video/mkv')
        ) {
        } else {
          validator = false;
        }
      });
      validator === 'valido' ? resolve(true) : resolve(false);
    });
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
      if (this.fileToUpload.length) {
        formData.append('projects_id', this.projectID.toString());
        this.fileToUpload.forEach((file) => {
          formData.append('asset', file);
        });
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
      this.fileToUpload = [];
      this.imageToShow = [
        {
          path: '../../../../../assets/no-image.png',
          type: 'image/png',
        },
      ];
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

  public stepBack(): void {
    this.location.back();
  }
}
