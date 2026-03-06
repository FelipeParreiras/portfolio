declare module "react" {
  export = any;
}
declare module "react-dom/client" {
  export const createRoot: any;
}
declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
declare module "react-router-dom" {
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export const Link: any;
  export const Outlet: any;
  export const useParams: any;
}
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}
