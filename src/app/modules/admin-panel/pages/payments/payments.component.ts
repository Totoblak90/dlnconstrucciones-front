import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProyectPayments } from '../../interfaces/users.interface';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ProjectsService } from '../../services/projects.service';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import { ProjectPaymentsReq } from '../../interfaces/projects.interface';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  public payments: ProyectPayments[] = [];
  public tableData: CuerpoTabla[] = [];
  public encabezadosTabla: string[] = ['Comprobante', 'Total', 'Fecha'];
  public loading: boolean = true;
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public paymentsForm!: FormGroup;
  public pagoId!: number;
  private userId!: number;
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
  }

  public getprojectId(): void {
    this.projectID = this.router.getCurrentNavigation()?.extras?.state?.id;
  }

  private createForm(): void {
    this.paymentsForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      receipt: ['', [Validators.required, Validators.minLength(5)]],
      datetime: [null, Validators.required],
    });
  }

  public formSubmit(): void {
    this.paymentsForm.markAllAsTouched();
    if (this.paymentsForm.valid) {
      const fechaDelPago: string =
        this.paymentsForm.controls.datetime.value.toString();

      const form: ProjectPaymentsReq = {
        projects_id: this.projectID,
        amount: this.paymentsForm.controls.amount.value,
        datetime: fechaDelPago,
        receipt: this.paymentsForm.controls.receipt.value,
      };

      this.crudAction === 'Crear'
        ? this.crearPagoEnLaDb(form)
        : this.editarPagoEnLaDb(form);
    }
  }

  private setTableData(): void {
    this.payments.forEach((payment: ProyectPayments) =>
      this.tableData.push({
        id: payment.id,
        item2: payment.receipt,
        item3: payment.amount.toString(),
        item4: payment.datetime.substring(0, 10),
      })
    );
  }

  ngOnInit(): void {
    this.getProject();
  }

  private getProject(): void {
    if (this.projectID) {
      this.projectsService
        .getOneProject(this.projectID)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          (res) => {
            if (res?.meta?.status.toString().includes('20')) {
              this.payments = res?.data?.Payments!;
              this.setTableData();
            } else {
              Swal.fire(
                '¡Lo sentimos!',
                'No pudimos cargar la información, por favor recarga la página',
                'error'
              );
            }
          },
          (err) =>
            Swal.fire(
              '¡Lo sentimos!',
              'No pudimos cargar la información, por favor recarga la página',
              'error'
            )
        );
    } else {
      this.router.navigateByUrl('/admin/proyectos');
    }
  }

  public recargarPagos(recargar: boolean): void {
    if (recargar) {
      this.resetsetControls();
      this.tableData = [];
      this.payments = [];
      this.isCreating = false;
      this.isEditing = false;
      this.getProject();
    }
  }

  private resetsetControls(): void {
    this.paymentsForm.controls.amount?.setValue(null);
    this.paymentsForm.controls.receipt?.setValue('');
    this.paymentsForm.controls.datetime?.setValue(null);
  }

  public crearPagos(): void {
    this.crudAction = 'Crear';
    this.isCreating = true;
    this.isEditing = false;
  }

  private crearPagoEnLaDb(form: ProjectPaymentsReq): void {
    this.projectsService
      .create(form, 'payments')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarPagos(true);
          this.alertFailureOrSuccess(
            res?.meta?.status,
            'El pago se creó correctamente'
          );
        },
        (err) => {
          this.recargarPagos(true);
          Swal.fire(
            'Error',
            'No pudimos crear el proyecto, por favor intentá de nuevo recargando la página',
            'error'
          );
        }
      );
  }

  public editarPagos(pagoId: number): void {
    this.crudAction = 'Editar';
    this.isEditing = true;
    this.isCreating = false;
    const pago: ProyectPayments | undefined = this.payments.find(
      (pay: ProyectPayments) => pay.id === pagoId
    );
    if (pago) {
      const fechaDePago: string = new Date(pago.datetime)
        .toISOString()
        .substring(0, 16);

      this.pagoId = pagoId;
      this.paymentsForm.controls.amount.setValue(pago.amount);
      this.paymentsForm.controls.receipt.setValue(pago.receipt);
      this.paymentsForm.controls.datetime.setValue(fechaDePago);
    }
  }

  private editarPagoEnLaDb(form: ProjectPaymentsReq): void {
    this.projectsService
      .edit(this.pagoId, form, 'payments')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          console.log(res);
          this.recargarPagos(true);
          this.alertFailureOrSuccess(
            res?.meta?.status,
            'El pago se editó correctamente'
          );
        },
        (err) => {
          console.log(err);
          this.recargarPagos(true);
          Swal.fire(
            'Error',
            'Tuvimos un error desconocido, por favor intenta recargar la página o espera un rato.',
            'error'
          );
        }
      );
  }

  public borrarPagos(pagoId: number): void {
    Swal.fire({
      title: '¿Seguro querés elimninar el pago seleccionado?',
      showDenyButton: true,
      confirmButtonText: 'Si, borrar',
      denyButtonText: `No`,
    }).then((result: SweetAlertResult<any>) => {
      result.isConfirmed ? this.borrarPagoEnLaDb(pagoId) : null;
    });
  }

  private borrarPagoEnLaDb(pagoId: number): void {
    this.adminPanelCrudService
      .delete(pagoId, 'payments')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.recargarPagos(true);
          this.alertFailureOrSuccess(
            res?.meta?.status,
            'El pago se eliminó correctamente'
          );
        },
        () => {
          Swal.fire(
            '¡Lo sentimos!',
            'No pudimos realizar el pedido correctamente, por favor actualizá la página e intentá de nuevo',
            'error'
          );
        }
      );
  }

  private alertFailureOrSuccess(status: number, message: string): void {
    if (status === 200 || status === 201) {
      Swal.fire('¡Excelente!', message, 'success');
    } else {
      Swal.fire(
        '¡Lo sentimos!',
        'No pudimos cargar la información, por favor recarga la página',
        'error'
      );
    }
  }
}
