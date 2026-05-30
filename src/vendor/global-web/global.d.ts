declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.scss';
declare module '*.css';
