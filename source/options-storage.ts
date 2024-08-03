import OptionsSyncPerDomain from 'webext-options-sync-per-domain';

import {importedFeatures} from '../readme.md';

export type RGHOptions = typeof defaults;

const defaults = Object.assign({
	actionUrl: 'https://github.com/',
	customCSS: '',
	personalToken: '',
	logging: false,
	logHTTP: false,
}, Object.fromEntries(importedFeatures.map(id => [`feature:${id}`, true])));

const renamedFeatures = new Map<string, string>([
	['separate-draft-pr-button', 'one-click-pr-or-gist'],
	['prevent-pr-commit-link-loss', 'prevent-link-loss'],
	['remove-projects-tab', 'remove-unused-repo-tabs'],
	['remove-unused-repo-tabs', 'clean-repo-tabs'],
	['more-dropdown', 'clean-repo-tabs'],
	['remove-diff-signs', 'hide-diff-signs'],
	['remove-label-faster', 'quick-label-hiding'],
	['edit-files-faster', 'quick-file-edit'],
	['edit-comments-faster', 'quick-comment-edit'],
	['delete-review-comments-faster', 'quick-review-comment-deletion'],
	['hide-comments-faster', 'quick-comment-hiding'],
	['faster-reviews', 'quick-review'],
	['faster-pr-diff-options', 'quick-pr-diff-options'],
	['hide-useless-comments', 'hide-low-quality-comments'],
	['hide-useless-newsfeed-events', 'hide-newsfeed-noise'],
	['hide-noisy-newsfeed-events', 'hide-newsfeed-noise'],
	['no-useless-split-diff-view', 'no-unnecessary-split-diff-view'],
	['unwrap-useless-dropdowns', 'unwrap-unnecessary-dropdowns'],
	['tag-changelog-link', 'tag-changes-link'],
	['navigate-pages-with-arrow-keys', 'pagination-hotkey'],
	['list-pr-for-branch', 'list-prs-for-branch'],
	['quick-label-hiding', 'quick-label-removal'],
	['next-scheduled-github-action', 'github-actions-indicators'],
	['raw-file-link', 'more-file-links'],
	['conversation-filters', 'more-conversation-filters'],
	['quick-pr-diff-options', 'one-click-diff-options'],
	['quick-review-buttons', 'one-click-review-submission'],
	['pull-request-hotkey', 'pull-request-hotkeys'],
	['first-published-tag-for-merged-pr', 'closing-remarks'],
	['scheduled-and-manual-workflow-indicators', 'github-actions-indicators'],
	['useful-forks', 'fork-notice'],
	['set-default-repositories-type-to-sources', 'hide-user-forks'],
	['highlight-deleted-and-added-files-in-diffs', 'new-or-deleted-file'],
	['enable-file-links-in-compare-view', 'actionable-pr-view-file'],
	['use-first-commit-message-for-new-prs', 'pr-first-commit-title`'],
	['comment-on-draft-pr-indicator', 'netiquette'],
	['draft-pr-notice', 'netiquette'],
]);

export function isFeatureDisabled(options: RGHOptions, id: string): boolean {
	// Must check if it's specifically `false`: It could be undefined if not yet in the readme or if misread from the entry point #6606
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
	return options[`feature:${id}`] === false;
}

export function getNewFeatureName(possibleFeatureName: string): FeatureID | undefined {
	let newFeatureName = possibleFeatureName;
	while (renamedFeatures.has(newFeatureName)) {
		newFeatureName = renamedFeatures.get(newFeatureName)!;
	}

	return importedFeatures.includes(newFeatureName as FeatureID) ? newFeatureName as FeatureID : undefined;
}

const migrations = [
	(options: RGHOptions): void => {
		for (const [from, to] of renamedFeatures) {
			if (typeof options[`feature:${from}`] === 'boolean') {
				options[`feature:${to}`] = options[`feature:${from}`];
			}
		}
	},

	// Removed features will be automatically removed from the options as well
	OptionsSyncPerDomain.migrations.removeUnused,
];

export const perDomainOptions = new OptionsSyncPerDomain({defaults, migrations});
export default perDomainOptions.getOptionsForOrigin();
