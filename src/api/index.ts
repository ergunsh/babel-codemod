import Config, { ConfigBuilder, Printer } from '../Config';
import { Source, SourceTransformResult } from '../TransformRunner';
import APIEngine from './APIEngine';

enum PluginType {
  local = 'local',
  remote = 'remote'
}

class PluginDecleration {
  use: string;
  options: Object;
  type: PluginType;

  constructor(
    use: string,
    options: Object,
    type: PluginType = PluginType.local
  ) {
    this.use = use;
    this.options = options;
    this.type = type;
  }
}

function createSource(source: Source | string): Source {
  return typeof source === 'string' ? new Source('', source) : source;
}

export default async function run(
  source: Source | string,
  plugins: Array<PluginDecleration>,
  usePrettier: boolean = false
): Promise<SourceTransformResult> {
  const configBuilder = new ConfigBuilder();

  plugins.forEach(decleration => {
    if (decleration.type === PluginType.remote) {
      configBuilder.addRemotePlugin(decleration.use);
    } else {
      configBuilder.addLocalPlugin(decleration.use);
    }
    configBuilder.setOptionsForPlugin(decleration.options, decleration.use);
  });

  if (usePrettier) {
    configBuilder.printer(Printer.Prettier);
  }

  return new APIEngine(createSource(source), configBuilder.build()).run();
}
