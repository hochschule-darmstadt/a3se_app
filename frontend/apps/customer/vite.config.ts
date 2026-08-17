import { reactRouter } from "@react-router/dev/vite";
import { mergeConfig } from "vite";

import { cctViteBase } from "../../vite.base";

export default mergeConfig(cctViteBase, { plugins: [reactRouter()] });
