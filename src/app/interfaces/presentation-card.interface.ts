export interface PresentationCard {
  imagePath: string;
  title: string;
  description?: string;
  routerAnchor?: RouterAnchor;
  downloadAnchor?: DownloadAnchor;
}

export interface RouterAnchor {
  route: string;
  innerText: string
}

export interface DownloadAnchor {
  innerText: string;
  href: string;
}
