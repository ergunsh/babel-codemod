import { BabelPlugin } from '../BabelPluginTypes';
import Config from '../Config';
import Transformer from '../Transformer';
import InlineTransformer from '../InlineTransformer';
import ProcessSnapshot from '../ProcessSnapshot';
import { Source, SourceTransformResult } from '../TransformRunner';

export default class APIEngine {
  constructor(readonly source: Source, readonly config: Config) {}

  private async loadPlugins(): Promise<Array<BabelPlugin>> {
    let snapshot = new ProcessSnapshot();
    let plugins: Array<BabelPlugin>;

    try {
      this.config.loadBabelTranspile();
      this.config.loadRequires();
      plugins = await this.config.getBabelPlugins();
    } finally {
      this.config.unloadBabelTranspile();
      snapshot.restore();
    }

    return plugins;
  }

  async run(): Promise<SourceTransformResult> {
    let plugins = await this.loadPlugins();
    let runner: Transformer;

    runner = new InlineTransformer(plugins);

    let result: SourceTransformResult;

    try {
      const output = await runner.transform(
        this.source.path,
        this.source.content
      );
      result = new SourceTransformResult(this.source, output, null);
    } catch (err) {
      result = new SourceTransformResult(this.source, null, err);
    }

    return result;
  }
}
