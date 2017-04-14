import * as _ from "lodash";
import * as glob from "glob";

namespace FsUtil {
  export function getExportFileList(inputDirName: string, ignore?: string | string[]): string[] {
    if (_.isEmpty(ignore)) ignore = '**/index.js*';
    return glob.sync(`${inputDirName}/**/*.js`, {ignore: ignore});
  }
}

export default FsUtil;
