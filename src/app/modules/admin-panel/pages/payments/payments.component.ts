import { Component, OnInit, OnDestroy, Host, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CuerpoTabla } from '../../interfaces/tabla.interface';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  OneProjectRes,
  Project,
  ProyectPayments,
} from '../../interfaces/users.interface';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ProjectsService } from '../../services/projects.service';
import { AdminPanelCrudService } from '../../services/admin-panel-crud.service';
import { ProjectPaymentsReq } from '../../interfaces/projects.interface';
import { CurrencyPipe } from '@angular/common';
import {
  alertFailureOrSuccessOnCRUDAction,
  unknownErrorAlert,
  noConnectionAlert,
} from '../../../../helpers/alerts';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  providers: [CurrencyPipe],
})
export class PaymentsComponent implements OnInit, OnDestroy {
  @HostBinding('class.admin-panel-container') someClass: Host = true;

  public payments: ProyectPayments[] = [];
  public tableData: CuerpoTabla[] = [];
  public encabezadosTabla: string[] = [
    'Descripción',
    'Detalle de pago',
    'Fecha',
    'Factura',
    'Moneda',
    'Subtotal',
    'IVA',
    'Total',
    'Cotización USD',
    'Total en USD',
  ];
  public formasDePago: string[] = ['Efectivo', 'Transferencia'];
  public monedas: string[] = ['ARS', 'USD'];
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public crudAction: string = '';
  public paymentsForm!: FormGroup;
  public pagoId!: number;
  public invalidPaymentMsg: string = '';
  private project!: Project;
  private projectID!: number;
  private destroy$: Subject<boolean> = new Subject();

  public get totalEnDolares(): number {
    let result = 0;
    if (
      +this.paymentsForm?.controls?.total?.value &&
      +this.paymentsForm.controls.cotizacionUsd.value
    ) {
      result =
        +this.paymentsForm.controls.total.value /
        +this.paymentsForm.controls.cotizacionUsd.value;
    }
    return result;
  }

  public get subTotal(): number {
    let result = 0;
    if (this.paymentsForm?.controls?.amount?.value) {
      this.paymentsForm.controls.iva.value === 'true'
        ? (result =
            +this.paymentsForm?.controls?.amount?.value -
            (+this.paymentsForm?.controls?.amount?.value * 21) / 100)
        : (result = +this.paymentsForm?.controls?.amount?.value);
    }
    this.paymentsForm.controls.total.setValue(result);
    return result;
  }

  constructor(
    private router: Router,
    private projectsService: ProjectsService,
    private fb: FormBuilder,
    private adminPanelCrudService: AdminPanelCrudService,
    private currencyPipe: CurrencyPipe
  ) {
    this.getprojectId();
    if (this.projectID) this.createForm();
    else this.router.navigateByUrl('/admin/proyectos');
  }

  public getprojectId(): void {
    this.projectID = this.router.getCurrentNavigation()?.extras?.state?.id;
  }

  private createForm(): void {
    this.paymentsForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      receipt: ['', [Validators.required]],
      datetime: [null, Validators.required],
      description: ['', Validators.required],
      wayToPay: [null, Validators.required],
      coin: [null, Validators.required],
      iva: [false],
      cotizacionUsd: [1, [Validators.required, Validators.min(1)]],
      total: [null, Validators.required],
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
        coin: this.paymentsForm.controls.coin.value,
        description: this.paymentsForm.controls.description.value,
        iva: this.paymentsForm.controls.iva.value === 'true',
        wayToPay: this.paymentsForm.controls.wayToPay.value,
      };

      if (this.paymentsForm.controls.coin.value === 'ARS') {
        form.cotizacionUsd = this.paymentsForm.controls.cotizacionUsd.value;
      }

      this.crudAction === 'Crear'
        ? this.crearPagoEnLaDb(form)
        : this.editarPagoEnLaDb(form);
    }
  }

  ngOnInit(): void {
    this.getProject();
    this.checkAmountValue();
    this.checkCotizacionValue();
  }

  private checkCotizacionValue(): void {
    this.paymentsForm.controls.coin.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res === 'USD' || !res) {
          this.paymentsForm.controls.cotizacionUsd.setValue(1);
        }
      });
  }

  private checkAmountValue(): void {
    this.paymentsForm.controls.total?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.validatePaymentAmount());
  }

  private validatePaymentAmount(): void {
    if (this.totalEnDolares && this.project.balance < this.totalEnDolares) {
      this.paymentsForm.controls.amount?.setErrors({ invalidAmount: true });
    } else {
      this.paymentsForm.controls.amount?.setErrors(null);
    }
  }

  public setCoinFormatAcordingToPaymentMethod(
    value: string,
    coinType: string
  ): string {
    if (coinType === 'ARS') {
      value = this.currencyPipe.transform(value)!;
    } else {
      value = this.currencyPipe.transform(value, 'USD', 'code')!;
      value = value.substring(0, 3) + ' ' + value.substring(3, value.length);
    }
    return value;
  }

  private getProject(): void {
    this.projectsService
      .getOneProject(this.projectID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: OneProjectRes) => {
          if (res?.meta?.status.toString().includes('20')) {
            this.project = res.data;
            this.payments = res?.data?.Payments!;
            this.setTableData();
          } else {
            unknownErrorAlert(res);
          }
        },
        (err) => noConnectionAlert(err)
      );
  }

  private setTableData(): void {
    this.payments.forEach((payment: ProyectPayments) =>
      this.tableData.push({
        id: payment.id,
        item2: payment.description,
        item3: payment.wayToPay,
        item4: payment.datetime?.substring(0, 10),
        item6: payment.receipt,
        item7: payment.coin,
        item8: this.setCoinFormatAcordingToPaymentMethod(
          payment.amount.toString(),
          payment.coin
        ),
        item9: payment.iva === 'true' ? 'Si' : 'No',
        item10: payment.subTotal
          ? this.setCoinFormatAcordingToPaymentMethod(
              payment.subTotal.toString(),
              payment.coin
            )
          : this.setCoinFormatAcordingToPaymentMethod(
              payment.amount?.toString(),
              payment.coin
            ),
        item11: payment.cotizacionUsd
          ? this.currencyPipe.transform(payment.cotizacionUsd?.toString())!
          : this.currencyPipe.transform(1)!,
        item12: this.setDolarCodeFormat(payment.totalUsd?.toString()),
      })
    );
  }

  public setDolarCodeFormat(value: string | undefined): string {
    value = this.currencyPipe.transform(value, 'USD', 'code')!;

    value = value.substring(0, 3) + ' ' + value.substring(3, value.length);

    return value!;
  }

  public setFormatAcordingToPaymentMethod(
    value: string,
    coinCode: string
  ): string {
    if (coinCode === 'USD') {
      value = this.currencyPipe.transform(value, 'USD', 'code')!;
    } else {
      value = this.currencyPipe.transform(value)!;
    }

    if (value.includes('USD')) {
      value = value.substring(0, 3) + ' ' + value.substring(3, value.length);
    }
    return value;
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
    this.paymentsForm.controls.description?.setValue('');
    this.paymentsForm.controls.wayToPay?.setValue(null);
    this.paymentsForm.controls.coin?.setValue(null);
    this.paymentsForm.controls.iva?.setValue(false);
    this.paymentsForm.controls.cotizacionUsd?.setValue(1);
    this.paymentsForm.controls.total?.setValue(null);
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
          alertFailureOrSuccessOnCRUDAction(res, 'creó', 'pago');
        },
        (err) => {
          this.recargarPagos(true);
          unknownErrorAlert(err);
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
      this.paymentsForm.controls.coin.setValue(pago.coin);
      this.paymentsForm.controls.cotizacionUsd.setValue(pago.cotizacionUsd);
      this.paymentsForm.controls.description.setValue(pago.description);
      this.paymentsForm.controls.iva.setValue(pago.iva);
      this.paymentsForm.controls.wayToPay.setValue(pago.wayToPay);
    }
  }

  private editarPagoEnLaDb(form: ProjectPaymentsReq): void {
    this.projectsService
      .edit(this.pagoId, form, 'payments')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.recargarPagos(true);
          alertFailureOrSuccessOnCRUDAction(res, 'editó', 'pago');
        },
        (err) => {
          this.recargarPagos(true);
          unknownErrorAlert(err);
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
          alertFailureOrSuccessOnCRUDAction(res, 'borró', 'pago');
        },
        (err) => unknownErrorAlert(err)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
