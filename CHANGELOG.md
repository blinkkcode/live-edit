# Changelog

## [3.3.0](https://www.github.com/blinkk/editor.dev-ui/compare/v3.2.1...v3.3.0) (2021-07-16)


### Features

* dark/light mode toggle ([#102](https://www.github.com/blinkk/editor.dev-ui/issues/102)) ([79812bb](https://www.github.com/blinkk/editor.dev-ui/commit/79812bb1f3be1f13956a8be5b4eb2c3edba80d4b))
* recent file list for the empty editor state. ([#104](https://www.github.com/blinkk/editor.dev-ui/issues/104)) ([19bc23a](https://www.github.com/blinkk/editor.dev-ui/commit/19bc23aed9b25862a0a465135481964898b94408))
* recent workspaces list on dashboard ([#107](https://www.github.com/blinkk/editor.dev-ui/issues/107)) ([5d7116a](https://www.github.com/blinkk/editor.dev-ui/commit/5d7116a39dc7da94e174c9463e8623fbc1b24a22))
* website dark mode ([ffbf4b5](https://www.github.com/blinkk/editor.dev-ui/commit/ffbf4b51765c81f15592a08abb6a94d5b6ad0948))


### Bug Fixes

* absolute paths for preview server config ([0a8a755](https://www.github.com/blinkk/editor.dev-ui/commit/0a8a7550c71f65f69b5c3569ae43a909f42c14e2))
* auto field guessing for specific project types ([#105](https://www.github.com/blinkk/editor.dev-ui/issues/105)) ([5e0a7bb](https://www.github.com/blinkk/editor.dev-ui/commit/5e0a7bb2564fb48e9a872c63cf2122ca6f4af398)), closes [#95](https://www.github.com/blinkk/editor.dev-ui/issues/95)
* cleanup the menu list item coloring and variables ([#101](https://www.github.com/blinkk/editor.dev-ui/issues/101)) ([3ca4816](https://www.github.com/blinkk/editor.dev-ui/commit/3ca4816a68a4a2f6cce8627439203fea3b344fb9))
* constant preview pane and loading status ([#99](https://www.github.com/blinkk/editor.dev-ui/issues/99)) ([7b9a970](https://www.github.com/blinkk/editor.dev-ui/commit/7b9a970e8f674c54ff2d6bd5dbc054f51253f4fd))
* improved styling for onboarding to use grid boxes ([bc5535b](https://www.github.com/blinkk/editor.dev-ui/commit/bc5535b86490c215ba028b9bb66fbe2e691a518a))
* missing preview config handled outside default handler ([#109](https://www.github.com/blinkk/editor.dev-ui/issues/109)) ([f261161](https://www.github.com/blinkk/editor.dev-ui/commit/f261161b21a220c26f4a1cd41617103ed43fbaf3)), closes [#106](https://www.github.com/blinkk/editor.dev-ui/issues/106)
* separate messaging for missing preview config ([4013084](https://www.github.com/blinkk/editor.dev-ui/commit/40130848a7168ce7121b3573c7090b4a339b9e46))
* title for truncated files in the site menu ([7860f13](https://www.github.com/blinkk/editor.dev-ui/commit/7860f1328b87b39ec44f3b282f501a6107b5f79e))

### [3.2.1](https://www.github.com/blinkk/editor.dev-ui/compare/v3.2.0...v3.2.1) (2021-07-12)


### Bug Fixes

* move all colors into the scheme ([#89](https://www.github.com/blinkk/editor.dev-ui/issues/89)) ([f7ea0da](https://www.github.com/blinkk/editor.dev-ui/commit/f7ea0da7b63e066c81a99375fe74fcd080e7d333))
* only truncate file names on hover for file list ([#92](https://www.github.com/blinkk/editor.dev-ui/issues/92)) ([ba051df](https://www.github.com/blinkk/editor.dev-ui/commit/ba051df1e10bcf9d8786a68d413a73ad177ba843))
* promise callback queue and example api for preview server ([#96](https://www.github.com/blinkk/editor.dev-ui/issues/96)) ([7ffa5d1](https://www.github.com/blinkk/editor.dev-ui/commit/7ffa5d1b693cef9ab07e084f1ac642ea2049a01f))
* reload iframe after file save ([#88](https://www.github.com/blinkk/editor.dev-ui/issues/88)) ([5234f40](https://www.github.com/blinkk/editor.dev-ui/commit/5234f403d5a6e6369a671b3b09e4428936670106)), closes [#87](https://www.github.com/blinkk/editor.dev-ui/issues/87)
* saving a file updates the url after save ([#83](https://www.github.com/blinkk/editor.dev-ui/issues/83)) ([ca43785](https://www.github.com/blinkk/editor.dev-ui/commit/ca43785843307e434ff12e77db4c700d6f7b02aa)), closes [#82](https://www.github.com/blinkk/editor.dev-ui/issues/82)
* show hover effect and actions on focus for list item ([3d5723b](https://www.github.com/blinkk/editor.dev-ui/commit/3d5723b2414d5c1659acb7f77c9b91d712c72116))

## [3.2.0](https://www.github.com/blinkk/editor.dev-ui/compare/v3.1.0...v3.2.0) (2021-07-09)


### Features

* ability to do arbitrary string literals ([#73](https://www.github.com/blinkk/editor.dev-ui/issues/73)) ([f6a1981](https://www.github.com/blinkk/editor.dev-ui/commit/f6a198128c8e6297b82d3be658df16c47bd0bd1f))
* loading status for editor files ([04d23a6](https://www.github.com/blinkk/editor.dev-ui/commit/04d23a6e1f816517e6052dce8c9e3c7778d5e142)), closes [#78](https://www.github.com/blinkk/editor.dev-ui/issues/78)
* preview server configuration and usage ([#77](https://www.github.com/blinkk/editor.dev-ui/issues/77)) ([231ea48](https://www.github.com/blinkk/editor.dev-ui/commit/231ea485a7fd1dab06d4b121c14e28c5f93c3cf3))


### Bug Fixes

* fix an issue when the media preview is not a string ([#81](https://www.github.com/blinkk/editor.dev-ui/issues/81)) ([5f40ad6](https://www.github.com/blinkk/editor.dev-ui/commit/5f40ad6e05d6e1718cc85c3766b54d7cdf43ae24))
* fix issue with hover and selected list items ([#75](https://www.github.com/blinkk/editor.dev-ui/issues/75)) ([cf4f2ac](https://www.github.com/blinkk/editor.dev-ui/commit/cf4f2aca6e3f0c0d1f214b14964a48d89ae4636e))
* hide menu modal when starting to load file ([d4143ca](https://www.github.com/blinkk/editor.dev-ui/commit/d4143ca055adc10c840bc5769955e326441f7a7b))
* tighten up the menu to fit more content ([#76](https://www.github.com/blinkk/editor.dev-ui/issues/76)) ([dcca4f3](https://www.github.com/blinkk/editor.dev-ui/commit/dcca4f39ba837402fc70dacb8faa59f21f00aab2))

## [3.1.0](https://www.github.com/blinkk/editor.dev-ui/compare/v3.0.0...v3.1.0) (2021-07-01)


### Features

* github onboarding flow ([#71](https://www.github.com/blinkk/editor.dev-ui/issues/71)) ([a7acf86](https://www.github.com/blinkk/editor.dev-ui/commit/a7acf86a147794a173c02d65acd8ae102b80f4e7))

## [3.0.0](https://www.github.com/blinkk/editor.dev-ui/compare/v2.0.0...v3.0.0) (2021-06-25)


### ⚠ BREAKING CHANGES

* move `sass` into `src` directory (#69)

### Features

* Banner for unstable version of the docs to direct to stable. ([82f554c](https://www.github.com/blinkk/editor.dev-ui/commit/82f554c5548b5247747a559942769b994c20d72f))
* dark mode editor ([#68](https://www.github.com/blinkk/editor.dev-ui/issues/68)) ([2b89d4d](https://www.github.com/blinkk/editor.dev-ui/commit/2b89d4d04ebabbab4c392011b0d659092ddf5d1d))
* Dark mode for the website. ([a6ed3e1](https://www.github.com/blinkk/editor.dev-ui/commit/a6ed3e15e216643359fdf60c9aa1632a9fcfc9e8))
* website maintained local server ui ([#67](https://www.github.com/blinkk/editor.dev-ui/issues/67)) ([a6ed3e1](https://www.github.com/blinkk/editor.dev-ui/commit/a6ed3e15e216643359fdf60c9aa1632a9fcfc9e8))


### Bug Fixes

* bad css indentation ([15e4cd3](https://www.github.com/blinkk/editor.dev-ui/commit/15e4cd313a618d85c6907da9e59bd0d462ae7c2b))
* docker build with symlinked build files. ([dcd1b7d](https://www.github.com/blinkk/editor.dev-ui/commit/dcd1b7d2f738b0bbeb04c88336249a033d3e1927))
* logo on website header ([ee9afac](https://www.github.com/blinkk/editor.dev-ui/commit/ee9afacddd85433a8b7a1d0cf3fac96f58f93479))
* Media list add new and lock new items when field is locked. ([921df0c](https://www.github.com/blinkk/editor.dev-ui/commit/921df0c4bdee4068f376ddc270504da26fcb81ee))
* redirect missing trailing slashes when not found ([c34f778](https://www.github.com/blinkk/editor.dev-ui/commit/c34f7786e5ee65b42f476d86210414396ce1de21))
* remove copy of old github callback file ([2a04f79](https://www.github.com/blinkk/editor.dev-ui/commit/2a04f792976a827ed287023d4e02149ddd233835))
* serve static files after normal routing ([f5e6036](https://www.github.com/blinkk/editor.dev-ui/commit/f5e60365b50e51a6e50364c868322f23cc6eca37))
* trim the summary for the history to the first line ([35b3af3](https://www.github.com/blinkk/editor.dev-ui/commit/35b3af375a6c01231f553246b4b82307a4967df9))
* update footer and header styling ([d8c37e3](https://www.github.com/blinkk/editor.dev-ui/commit/d8c37e33c373b268135e6b4baae02cea6d5e38ae))
* website root using `cwd`. ([ff27ba7](https://www.github.com/blinkk/editor.dev-ui/commit/ff27ba72307ab8b0fa5c004284dd24e7ab045936))


### Code Refactoring

* move `sass` into `src` directory ([#69](https://www.github.com/blinkk/editor.dev-ui/issues/69)) ([995b41d](https://www.github.com/blinkk/editor.dev-ui/commit/995b41d996992c612edee481ab02de75a3a72869))

## [2.0.0](https://www.github.com/blinkk/editor.dev-ui/compare/v1.3.7...v2.0.0) (2021-06-22)


### ⚠ BREAKING CHANGES

* Media field improvements (#58)

### Features

* Media field improvements ([#58](https://www.github.com/blinkk/editor.dev-ui/issues/58)) ([d283b3e](https://www.github.com/blinkk/editor.dev-ui/commit/d283b3ea69c1e1b4b92b28236b13756e6620f972))


### Bug Fixes

* Add missing amagaki yaml type. ([8797645](https://www.github.com/blinkk/editor.dev-ui/commit/879764573bc59447cf8a1c8c4708e9c3a67625e4))
* correct documentation build for releases. ([c9ed85b](https://www.github.com/blinkk/editor.dev-ui/commit/c9ed85b7945f327559fa5929b27b8766248f6765))
* Html and Markdown fields support for image uploads ([#61](https://www.github.com/blinkk/editor.dev-ui/issues/61)) ([eb95c59](https://www.github.com/blinkk/editor.dev-ui/commit/eb95c59b2fe919f935b176a603aafdce1381cf75))
* Remove LiveEditor from default export. ([6c8de6b](https://www.github.com/blinkk/editor.dev-ui/commit/6c8de6bc929a4cf4cc61bfb23eefe2589c8be2df))
* Update label for media list expanded view to use label. ([fa962d4](https://www.github.com/blinkk/editor.dev-ui/commit/fa962d41a29adc0e7ec90a3720f712a43a771857))
* Upload file needs to use fetch until bent issue is fixed. ([#60](https://www.github.com/blinkk/editor.dev-ui/issues/60)) ([03b563d](https://www.github.com/blinkk/editor.dev-ui/commit/03b563dc924a67796d50605ed803087ed8f4c297))
* Use the path for input value in the media field. ([1bb86e3](https://www.github.com/blinkk/editor.dev-ui/commit/1bb86e37bd8475ac538952603cb2f383a0569384))

### [1.3.7](https://www.github.com/blinkk/editor.dev-ui/compare/v1.3.6...v1.3.7) (2021-06-17)


### Bug Fixes

* Adding tsc compile for the publish only. ([3d71c9b](https://www.github.com/blinkk/editor.dev-ui/commit/3d71c9b45ceb88e0b7ad3bf6b484c02f80274fd8))
* Simplify the yarn publishing process. ([5e30c55](https://www.github.com/blinkk/editor.dev-ui/commit/5e30c554fe4b4c5e2686b0662eeaaa1c86c9b241))

### [1.3.6](https://www.github.com/blinkk/editor.dev-ui/compare/v1.3.5...v1.3.6) (2021-06-16)


### Bug Fixes

* Pass the tag from release please to deploy to prod. ([fdf68cc](https://www.github.com/blinkk/editor.dev-ui/commit/fdf68ccbc25d44ed01bac7d55234a2dbbf93a4be))

### [1.3.5](https://www.github.com/blinkk/editor.dev-ui/compare/v1.3.4...v1.3.5) (2021-06-16)


### Bug Fixes

* Deploy on release creation. ([864d7f3](https://www.github.com/blinkk/editor.dev-ui/commit/864d7f35ca65386ff55abd318c4d1fb16e508ae2))

### [1.3.4](https://www.github.com/blinkk/editor.dev-ui/compare/v1.3.3...v1.3.4) (2021-06-16)


### Bug Fixes

* add deploy step after tagging. ([d6c87d1](https://www.github.com/blinkk/editor.dev-ui/commit/d6c87d11cd0dc578f3fbb769b35b43fd27071b9b))
* Remove deploy from the release please process. ([012a73e](https://www.github.com/blinkk/editor.dev-ui/commit/012a73ed0162b00137e6692ae9bf3b1d3aa456d9))

### [1.3.3](https://www.github.com/blinkk/editor.dev-ui/compare/v1.3.2...v1.3.3) (2021-06-16)


### Bug Fixes

* skip lib check when compiling for prod. ([30ae60a](https://www.github.com/blinkk/editor.dev-ui/commit/30ae60ad78e8dc0b161c6515e1a247ffa74ebd79))

### [1.3.2](https://www.github.com/blinkk/editor.dev-ui/compare/v1.3.1...v1.3.2) (2021-06-16)


### Bug Fixes

* Update release process to deploy production version. ([38d6f19](https://www.github.com/blinkk/editor.dev-ui/commit/38d6f1989a29505eb694a22648a630ec023309d5))

### [1.3.1](https://www.github.com/blinkk/editor.dev-ui/compare/v1.3.0...v1.3.1) (2021-06-16)


### Bug Fixes

* Update gcloud ids to be valid. ([b60c4c9](https://www.github.com/blinkk/editor.dev-ui/commit/b60c4c94fc77db7d8c8f2e3d0cfd0b41a96c0469))
* Update image ids for cloudbuild. ([3ea60a8](https://www.github.com/blinkk/editor.dev-ui/commit/3ea60a86e7d6230682bab9cab025c5ac330526d9))
* Using older version of tui editor. ([f56fdad](https://www.github.com/blinkk/editor.dev-ui/commit/f56fdada1da08e88ab0d64fdac003c51d184bb2d))

## [1.3.0](https://www.github.com/blinkk/editor.dev-ui/compare/v1.2.1...v1.3.0) (2021-06-15)


### Features

* Html and Markdown Fields ([#49](https://www.github.com/blinkk/editor.dev-ui/issues/49)) ([51c5c4d](https://www.github.com/blinkk/editor.dev-ui/commit/51c5c4de2ce3ff657aeefd63e36923d4ca61c612))

### [1.2.1](https://www.github.com/blinkk/editor.dev-ui/compare/v1.2.0...v1.2.1) (2021-05-21)


### Bug Fixes

* Release please release process for packaging. ([5daadd1](https://www.github.com/blinkk/editor.dev-ui/commit/5daadd170d1b26172a7fa79b3ff447e97d7cea0f))

## [1.2.0](https://www.github.com/blinkk/editor.dev-ui/compare/v1.1.0...v1.2.0) (2021-05-21)


### Features

* Dynamic remote media providers for editor server. ([#45](https://www.github.com/blinkk/editor.dev-ui/issues/45)) ([0f04cdc](https://www.github.com/blinkk/editor.dev-ui/commit/0f04cdc9bf7615ee184d37236d93b6487203c772))

## [1.1.0](https://www.github.com/blinkk/editor.dev-ui/compare/v1.0.24...v1.1.0) (2021-05-20)


### Features

* remote media upload ([#43](https://www.github.com/blinkk/editor.dev-ui/issues/43)) ([f7c73b3](https://www.github.com/blinkk/editor.dev-ui/commit/f7c73b335dd7f687f31e4fc68c3a9d3446e9393e))
