// Components every MDX file can use without importing them. Passed to the
// Content component by the layouts.
import Callout from "./Callout.astro";
import Chart from "./Chart.astro";
import Describe from "./Describe.astro";
import Figure from "./Figure.astro";

export const mdxComponents = { Callout, Chart, Describe, Figure };
