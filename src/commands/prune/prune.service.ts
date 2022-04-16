import Table from 'cli-table3';
import inquirer from 'inquirer';
import { chain, trim } from 'lodash';
import simpleGit, { BranchSummary, BranchSummaryBranch } from 'simple-git';

import { Injectable } from '@nestjs/common';

interface IExtraData { isMerged?: boolean; remoteName?: string }

type BranchWithExtras = BranchSummaryBranch & IExtraData;

const git = simpleGit();
const remoteInfoRegex = /^\[(.*?)\]\s/g;

const chars = {
  'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
  'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
  'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
  'right': '║', 'right-mid': '╢', 'middle': '│'
};

@Injectable()
export class PruneService {
  MAIN_BRANCHES = [
    'master',
    'main',
    'develop',
    'dev',
    'staging',
    'next',
    'beta',
    'alpha'
  ];

  async pruneMergedBranches() {
    try {
      // prune? is it necassery?
      await git.fetch([ '-p' ]);
      const branchSummaryResult = await git.branch([ '-vv' ]);
      const localBranches = branchSummaryResult.branches;
      const localBranchesWithGoneRemotes: BranchWithExtras[] =
        chain(localBranches)
          .filter((item) => !this.MAIN_BRANCHES.includes(item.name))
          .forEach((item: BranchWithExtras) => {
            // console.log('an item appeared!', item);
            const remoteInfo = item.label.match(remoteInfoRegex);

            if (remoteInfo) {
              const parsedRemoteInfo = trim(remoteInfo[0], '[] ');
              const isMerged = parsedRemoteInfo.endsWith(': gone');
              const remoteBranchName = parsedRemoteInfo.replace(': gone', '');

              item.isMerged = isMerged;
              item.remoteName = remoteBranchName;
            }
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((item) => (item as any).isMerged)
          .value();
      const branchNames = chain(localBranchesWithGoneRemotes).map('name').value();

      if (!branchNames.length) {
        console.log('PROJECT IS CLEAN! WELL DONE!');
        process.exit(0);
        return;
      }

      // interaction!
      const table = new Table({
        head: [ 'Branch Name', 'Origin Branch Name', 'Origin Branch Status' ],
        chars
      });

      localBranchesWithGoneRemotes
        .forEach((item) => table.push([ item.name, item.remoteName, 'GONE' ]));

      console.log(`${ table.toString() }\n`);

      const ACTION_ANSWERS = {
        PRUNE_ALL: 'prune all gone branches',
        SELECT_BRANCHES: 'Selected Individual branches to delete'
      };

      const answers = await inquirer
        .prompt([
          {
            type: 'list',
            name: 'whatToDo',
            message: [
              'These branches have been deleted from the origin. ',
              'What do you want to do with them?'
            ].join(''),
            choices: chain(ACTION_ANSWERS).values().value()
          }
        ]);

      if (answers.whatToDo === ACTION_ANSWERS.PRUNE_ALL) {
        await this.moveToAnotherBranchIfNeeded(
          branchSummaryResult,
          branchNames
        );

        const result = await git.deleteLocalBranches(branchNames, true);
        console.log('DONE');
        chain(result.all)
          .map((item) => this.getStatusString(item))
          .forEach((item) => console.log(item))
          .value();
        return;
      }

      if (answers.whatToDo === ACTION_ANSWERS.SELECT_BRANCHES) {
        const answers = await inquirer
          .prompt([
            {
              type: 'checkbox',
              message: [
                'These branches have been deleted from the origin. ',
                'Do you want to prune them?'
              ].join(''),
              name: 'pruneBranches',
              choices: branchNames
            }
          ]);

        await this.moveToAnotherBranchIfNeeded(
          branchSummaryResult,
          branchNames
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const deleteBranchPromises: Promise<any>[] = answers.pruneBranches
          .map((branchName: string) => git.deleteLocalBranch(branchName, true));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = await Promise.all(deleteBranchPromises);
        console.log('DONE');
        console.log(result);
        chain(result.all)
          .map((item) => this.getStatusString(item))
          .forEach((item) => console.log(item));
        return;
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
      return;
    }
  }

  async moveToAnotherBranchIfNeeded(
    branchSummaryResult: BranchSummary,
    branchesToDelete: string[]
  ) {
    const suspectedMainBranch = branchSummaryResult.all
      .find((branchName: string) =>
        this.MAIN_BRANCHES.includes(branchName)
      ) as string;
    const currentCheckedoutBranch = branchSummaryResult.current;

    // console.log('main branch:', suspectedMainBranch);

    if (branchesToDelete.includes(currentCheckedoutBranch)) {
      console.warn([
        `trying to delete checkedout branch ${ currentCheckedoutBranch }. `,
        `moving to ${ suspectedMainBranch }`
      ].join(''));
      await git.checkout(suspectedMainBranch);
    }
  }

  getStatusString(item: { branch: string; success: boolean }) {
    return `${ item.branch }: ${ item.success ? 'DELETED' : 'FAILED' }`;
  }

  getMainBranch(
    branchSummaryResult: BranchSummary,
    mainBranchList = this.MAIN_BRANCHES
  ) {
    for (const branchName of mainBranchList) {
      if (branchSummaryResult[branchName]) {
        return branchSummaryResult[branchName];
      }
    }
  }

  checkIsMainBranchCheckedOut(
    branchSummaryResult: BranchSummary,
    mainBranchList = this.MAIN_BRANCHES
  ) {
    const currentCheckedoutBranch = branchSummaryResult.current;
    return mainBranchList.includes(currentCheckedoutBranch) ?
    currentCheckedoutBranch :
    false;
  }
}
