import Config from '../Config';
import { Source, SourceTransformResult } from '../TransformRunner';
import APIEngine from './APIEngine';

// Polyfill `Symbol.asyncIterator` so `for await` will work.
if (!Symbol.asyncIterator) {
  Symbol['asyncIterator' as string] =
    Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator');
}

export default async function run(
  source: Source,
  config: Config = new Config(),
  onTransform = () => {}
): Promise<SourceTransformResult> {
  return new APIEngine(config, onTransform, source).run();
}
