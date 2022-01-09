import Swal, { SweetAlertIcon } from 'sweetalert2';

export function noConnectionAlert(): void {
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

export function unknownErrorAlert(): void {
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
  icon: SweetAlertIcon | undefined = undefined,
  buttonText: string
): void {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn bgc-primary-dark',
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
