import Swal, { SweetAlertIcon } from 'sweetalert2';
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn bgc-primary-dark text-white',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

export function noConnectionAlert(err: any): void {
  console.log(err);

  swalWithBootstrapButtons.fire({
    title: 'Error',
    text: 'Tuvimos un problema de conexión. Chequeá tu conexión a internet y recargá la página y volvé a intentar. Si el problema persiste ponete en contacto con el administrador de la página',
    icon: 'warning',
    confirmButtonText: 'OK',
  });
}

export function unknownErrorAlert(data?: any): void {
  console.log(data);

  swalWithBootstrapButtons.fire({
    title: 'Error',
    text: '¡Lo sentimos!, hay un error desconocido. Probá cargando la info nuevamente y chequeando las validaciones. Si el problema persiste ponete en contacto con el administrador de la página',
    icon: 'warning',
    confirmButtonText: 'OK',
  });
}

export function customMessageAlert(
  title: string,
  text: string,
  buttonText: string,
  icon?: SweetAlertIcon
): void {
  swalWithBootstrapButtons.fire({
    title,
    text,
    icon,
    confirmButtonText: buttonText,
  });
}

export function alertFailureOrSuccessOnCRUDAction(
  data: any,
  action: 'creó' | 'editó' | 'borró',
  table:
    | 'interés'
    | 'proyecto'
    | 'lote'
    | 'pago'
    | 'archivo'
    | 'servicio'
    | 'contenido'
    | 'imagen de servicio'
    | 'tipo de trabajo'
    | 'trabajo realizado'
    | 'usuario'
    | 'zona'
): void {
  if (data?.meta?.status?.toString().includes('20')) {
    customMessageAlert(
      'Excelente',
      `El ${table} se ${action} correctamente`,
      'OK',
      'success'
    );
  } else {
    unknownErrorAlert(data);
  }
}

export function customMessageAlertWithActions(
  title: string,
  text: string,
  buttonText: string,
  icon?: SweetAlertIcon
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    swalWithBootstrapButtons
      .fire({
        title,
        text,
        icon,
        confirmButtonText: buttonText,
      })
      .then((result) => {
        result.isConfirmed ? resolve(true) : reject(false);
      });
  });
}
