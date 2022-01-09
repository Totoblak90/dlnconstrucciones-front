import Swal, { SweetAlertIcon } from 'sweetalert2';

export function noConnectionAlert(err: any): void {
  console.log(err);
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn bgc-primary-dark',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons.fire({
    title: 'Error',
    text: 'Tuvimos un problema de conexión. Chequeá tu conexión a internet y recargá la página y volvé a intentar. Si el problema persiste ponete en contacto con el administrador de la página',
    icon: 'warning',
    confirmButtonText: 'OK',
  });
}

export function unknownErrorAlert(data?: any): void {
  data ? console.log(data) : null;

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn bgc-primary-dark',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false,
  });
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
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn bgc-primary-dark text-white',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false,
  });
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
  table: 'interés' | 'proyecto' | 'lote' | 'pago' | 'servicio' | 'tipo de trabajo' | 'trabajo realizado' | 'usuario'
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
