export interface Menu {
  description: string;
  redirectTo?: string;
  moreOptions?: boolean;
  subMenu?: Menu[];
  icon?: string;
  toggle: boolean;
  inMobile: boolean;
  redirectWithFunction?: void;
}
