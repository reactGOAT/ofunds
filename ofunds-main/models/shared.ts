import { StaticImageData } from "next/image";
import { ReactNode } from "react";

export type ImageModel = { img: StaticImageData | string };

export interface LayoutProps {
  children?: ReactNode;
}

export interface IProps {
  title?: string;
  desc?: ReactNode;
}

export interface Reset {
  reset: () => void;
}

export interface DefaultDialogProps {
  isOpen?: boolean;
  onClose: () => void;
}

export type UpdateActions<P> = {
  update: <T extends P[keyof P]>(key: keyof P, value: T) => void;
  initStore?: (store: P) => void;
};

export interface DataCreationDate<T = string> {
  created_at: T;
  updated_at: T;
}

export interface SharedIDProps {
  id?: string;
}

export type RequiredIDProp = Required<SharedIDProps>;
