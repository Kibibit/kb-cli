import { isEmpty } from 'lodash';
import simpleGit from 'simple-git';

import { Injectable } from '@nestjs/common';

import { PruneService } from '../prune/prune.service';

const git = simpleGit();

@Injectable()
export class GithooksService {
  constructor(
    private readonly pruneService: PruneService
  ) {}

  async disallowMainBranchesCommits(mainBranchList?: string[]) {
    try {
      // eslint-disable-next-line no-undefined
      mainBranchList = isEmpty(mainBranchList) ? undefined : mainBranchList;
      const branchSummaryResult = await git.branch([ '-vv' ]);
      const isMainBranchCheckedOut =
        this.pruneService.checkIsMainBranchCheckedOut(
          branchSummaryResult,
          mainBranchList
        );

      if (isMainBranchCheckedOut) {
        console.log([
          'Should not commit directly to ',
          `${ isMainBranchCheckedOut } branch when working locally`
        ].join(''));
        process.exit(1);
      }
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}
