declare module "nprogress" {
  interface NProgressOptions {
    minimum?: number;
    easing?: string;
    speed?: number;
    trickle?: boolean;
    trickleSpeed?: number;
    showSpinner?: boolean;
    parent?: string;
    template?: string;
  }

  interface NProgress {
    start: () => NProgress;
    done: (force?: boolean) => NProgress;
    set: (n: number) => NProgress;
    inc: (amount?: number) => NProgress;
    configure: (options: Partial<NProgressOptions>) => void;
    status: null | number;
  }

  const NProgress: NProgress;
  export default NProgress;
}
