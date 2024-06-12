import { BuiltinTheme } from '@opensumi/ide-theme';

export default {
  tokenColors: [
    {
      scope: ['meta.embedded', 'source.groovy.embedded'],
      settings: {
        foreground: '#000000ff',
      },
    },
    {
      scope: 'emphasis',
      settings: {
        fontStyle: 'italic',
      },
    },
    {
      scope: 'strong',
      settings: {
        fontStyle: 'bold',
      },
    },
    {
      scope: 'meta.diff.header',
      settings: {
        foreground: '#000080',
      },
    },
    {
      scope: 'comment',
      settings: {
        foreground: '#008000',
      },
    },
    {
      scope: 'constant.language',
      settings: {
        foreground: '#0000ff',
      },
    },
    {
      scope: [
        'constant.numeric',
        'variable.other.enummember',
        'keyword.operator.plus.exponent',
        'keyword.operator.minus.exponent',
      ],
      settings: {
        foreground: '#098658',
      },
    },
    {
      scope: 'constant.regexp',
      settings: {
        foreground: '#811f3f',
      },
    },
    {
      name: 'css tags in selectors, xml tags',
      scope: 'entity.name.tag',
      settings: {
        foreground: '#800000',
      },
    },
    {
      scope: 'entity.name.selector',
      settings: {
        foreground: '#800000',
      },
    },
    {
      scope: 'entity.other.attribute-name',
      settings: {
        foreground: '#ff0000',
      },
    },
    {
      scope: [
        'entity.other.attribute-name.class.css',
        'entity.other.attribute-name.class.mixin.css',
        'entity.other.attribute-name.id.css',
        'entity.other.attribute-name.parent-selector.css',
        'entity.other.attribute-name.pseudo-class.css',
        'entity.other.attribute-name.pseudo-element.css',
        'source.css.less entity.other.attribute-name.id',
        'entity.other.attribute-name.scss',
      ],
      settings: {
        foreground: '#800000',
      },
    },
    {
      scope: 'invalid',
      settings: {
        foreground: '#cd3131',
      },
    },
    {
      scope: 'markup.underline',
      settings: {
        fontStyle: 'underline',
      },
    },
    {
      scope: 'markup.bold',
      settings: {
        fontStyle: 'bold',
        foreground: '#000080',
      },
    },
    {
      scope: 'markup.heading',
      settings: {
        fontStyle: 'bold',
        foreground: '#800000',
      },
    },
    {
      scope: 'markup.italic',
      settings: {
        fontStyle: 'italic',
      },
    },
    {
      scope: 'markup.inserted',
      settings: {
        foreground: '#098658',
      },
    },
    {
      scope: 'markup.deleted',
      settings: {
        foreground: '#a31515',
      },
    },
    {
      scope: 'markup.changed',
      settings: {
        foreground: '#0451a5',
      },
    },
    {
      scope: ['punctuation.definition.quote.begin.markdown', 'punctuation.definition.list.begin.markdown'],
      settings: {
        foreground: '#0451a5',
      },
    },
    {
      scope: 'markup.inline.raw',
      settings: {
        foreground: '#800000',
      },
    },
    {
      name: 'brackets of XML/HTML tags',
      scope: 'punctuation.definition.tag',
      settings: {
        foreground: '#800000',
      },
    },
    {
      scope: ['meta.preprocessor', 'entity.name.function.preprocessor'],
      settings: {
        foreground: '#0000ff',
      },
    },
    {
      scope: 'meta.preprocessor.string',
      settings: {
        foreground: '#a31515',
      },
    },
    {
      scope: 'meta.preprocessor.numeric',
      settings: {
        foreground: '#098658',
      },
    },
    {
      scope: 'meta.structure.dictionary.key.python',
      settings: {
        foreground: '#0451a5',
      },
    },
    {
      scope: 'storage',
      settings: {
        foreground: '#0000ff',
      },
    },
    {
      scope: 'storage.type',
      settings: {
        foreground: '#0000ff',
      },
    },
    {
      scope: ['storage.modifier', 'keyword.operator.noexcept'],
      settings: {
        foreground: '#0000ff',
      },
    },
    {
      scope: ['string', 'meta.embedded.assembly'],
      settings: {
        foreground: '#a31515',
      },
    },
    {
      scope: [
        'string.comment.buffered.block.pug',
        'string.quoted.pug',
        'string.interpolated.pug',
        'string.unquoted.plain.in.yaml',
        'string.unquoted.plain.out.yaml',
        'string.unquoted.block.yaml',
        'string.quoted.single.yaml',
        'string.quoted.double.xml',
        'string.quoted.single.xml',
        'string.unquoted.cdata.xml',
        'string.quoted.double.html',
        'string.quoted.single.html',
        'string.unquoted.html',
        'string.quoted.single.handlebars',
        'string.quoted.double.handlebars',
      ],
      settings: {
        foreground: '#0000ff',
      },
    },
    {
      scope: 'string.regexp',
      settings: {
        foreground: '#811f3f',
      },
    },
    {
      name: 'String interpolation',
      scope: [
        'punctuation.definition.template-expression.begin',
        'punctuation.definition.template-expression.end',
        'punctuation.section.embedded',
      ],
      settings: {
        foreground: '#0000ff',
      },
    },
    {
      name: 'Reset JavaScript string interpolation expression',
      scope: ['meta.template.expression'],
      settings: {
        foreground: '#000000',
      },
    },
    {
      scope: [
        'support.constant.property-value',
        'support.constant.font-name',
        'support.constant.media-type',
        'support.constant.media',
        'constant.other.color.rgb-value',
        'constant.other.rgb-value',
        'support.constant.color',
      ],
      settings: {
        foreground: '#0451a5',
      },
    },
    {
      scope: [
        'support.type.vendored.property-name',
        'support.type.property-name',
        'variable.css',
        'variable.scss',
        'variable.other.less',
        'source.coffee.embedded',
      ],
      settings: {
        foreground: '#ff0000',
      },
    },
    {
      scope: ['support.type.property-name.json'],
      settings: {
        foreground: '#0451a5',
      },
    },
    {
      scope: 'keyword',
      settings: {
        foreground: '#0000ff',
      },
    },
    {
      scope: 'keyword.control',
      settings: {
        foreground: '#0000ff',
      },
    },
    {
      scope: 'keyword.operator',
      settings: {
        foreground: '#000000',
      },
    },
    {
      scope: [
        'keyword.operator.new',
        'keyword.operator.expression',
        'keyword.operator.cast',
        'keyword.operator.sizeof',
        'keyword.operator.alignof',
        'keyword.operator.typeid',
        'keyword.operator.alignas',
        'keyword.operator.instanceof',
        'keyword.operator.logical.python',
        'keyword.operator.wordlike',
      ],
      settings: {
        foreground: '#0000ff',
      },
    },
    {
      scope: 'keyword.other.unit',
      settings: {
        foreground: '#098658',
      },
    },
    {
      scope: ['punctuation.section.embedded.begin.php', 'punctuation.section.embedded.end.php'],
      settings: {
        foreground: '#800000',
      },
    },
    {
      scope: 'support.function.git-rebase',
      settings: {
        foreground: '#0451a5',
      },
    },
    {
      scope: 'constant.sha.git-rebase',
      settings: {
        foreground: '#098658',
      },
    },
    {
      name: 'coloring of the Java import and package identifiers',
      scope: ['storage.modifier.import.java', 'variable.language.wildcard.java', 'storage.modifier.package.java'],
      settings: {
        foreground: '#000000',
      },
    },
    {
      name: 'this.self',
      scope: 'variable.language',
      settings: {
        foreground: '#0000ff',
      },
    },
    {
      name: 'Function declarations',
      scope: [
        'entity.name.function',
        'support.function',
        'support.constant.handlebars',
        'source.powershell variable.other.member',
        'entity.name.operator.custom-literal', // See https://en.cppreference.com/w/cpp/language/user_literal
      ],
      settings: {
        foreground: '#795E26',
      },
    },
    {
      name: 'Types declaration and references',
      scope: [
        'meta.return-type',
        'support.class',
        'support.type',
        'entity.name.type',
        'entity.name.namespace',
        'entity.other.attribute',
        'entity.name.scope-resolution',
        'entity.name.class',
        'storage.type.numeric.go',
        'storage.type.byte.go',
        'storage.type.boolean.go',
        'storage.type.string.go',
        'storage.type.uintptr.go',
        'storage.type.error.go',
        'storage.type.rune.go',
        'storage.type.cs',
        'storage.type.generic.cs',
        'storage.type.modifier.cs',
        'storage.type.variable.cs',
        'storage.type.annotation.java',
        'storage.type.generic.java',
        'storage.type.java',
        'storage.type.object.array.java',
        'storage.type.primitive.array.java',
        'storage.type.primitive.java',
        'storage.type.token.java',
        'storage.type.groovy',
        'storage.type.annotation.groovy',
        'storage.type.parameters.groovy',
        'storage.type.generic.groovy',
        'storage.type.object.array.groovy',
        'storage.type.primitive.array.groovy',
        'storage.type.primitive.groovy',
      ],
      settings: {
        foreground: '#267f99',
      },
    },
    {
      name: 'Types declaration and references, TS grammar specific',
      scope: [
        'meta.type.cast.expr',
        'meta.type.new.expr',
        'support.constant.math',
        'support.constant.dom',
        'support.constant.json',
        'entity.other.inherited-class',
      ],
      settings: {
        foreground: '#267f99',
      },
    },
    {
      name: 'Control flow / Special keywords',
      scope: [
        'keyword.control',
        'source.cpp keyword.operator.new',
        'source.cpp keyword.operator.delete',
        'keyword.other.using',
        'keyword.other.operator',
        'entity.name.operator',
      ],
      settings: {
        foreground: '#AF00DB',
      },
    },
    {
      name: 'Variable and parameter name',
      scope: [
        'variable',
        'meta.definition.variable.name',
        'support.variable',
        'entity.name.variable',
        'constant.other.placeholder', // placeholders in strings
      ],
      settings: {
        foreground: '#001080',
      },
    },
    {
      name: 'Constants and enums',
      scope: ['variable.other.constant', 'variable.other.enummember'],
      settings: {
        foreground: '#0070C1',
      },
    },
    {
      name: 'Object keys, TS grammar specific',
      scope: ['meta.object-literal.key'],
      settings: {
        foreground: '#001080',
      },
    },
    {
      name: 'CSS property value',
      scope: [
        'support.constant.property-value',
        'support.constant.font-name',
        'support.constant.media-type',
        'support.constant.media',
        'constant.other.color.rgb-value',
        'constant.other.rgb-value',
        'support.constant.color',
      ],
      settings: {
        foreground: '#0451a5',
      },
    },
    {
      name: 'Regular expression groups',
      scope: [
        'punctuation.definition.group.regexp',
        'punctuation.definition.group.assertion.regexp',
        'punctuation.definition.character-class.regexp',
        'punctuation.character.set.begin.regexp',
        'punctuation.character.set.end.regexp',
        'keyword.operator.negation.regexp',
        'support.other.parenthesis.regexp',
      ],
      settings: {
        foreground: '#d16969',
      },
    },
    {
      scope: [
        'constant.character.character-class.regexp',
        'constant.other.character-class.set.regexp',
        'constant.other.character-class.regexp',
        'constant.character.set.regexp',
      ],
      settings: {
        foreground: '#811f3f',
      },
    },
    {
      scope: 'keyword.operator.quantifier.regexp',
      settings: {
        foreground: '#000000',
      },
    },
    {
      scope: ['keyword.operator.or.regexp', 'keyword.control.anchor.regexp'],
      settings: {
        foreground: '#EE0000',
      },
    },
    {
      scope: 'constant.character',
      settings: {
        foreground: '#0000ff',
      },
    },
    {
      scope: 'constant.character.escape',
      settings: {
        foreground: '#EE0000',
      },
    },
    {
      scope: 'entity.name.label',
      settings: {
        foreground: '#000000',
      },
    },
  ],
  colors: {
    'activityBar.activeBorder': '#151b2114',
    'activityBar.activeForeground': '#FFFFFF',
    'activityBar.background': '#00000000',
    'activityBar.border': '#252729',
    'activityBar.disableForeground': '#5F656B',
    'activityBar.dropBackground': '#43484D',
    'activityBar.foreground': '#151b21',
    'activityBar.inactiveForeground': '#151b21a6',
    'activityBarBadge.background': '#3C8DFF',
    'activityBarBadge.foreground': '#FFFFFF',
    'badge.background': '#151b5814',
    'badge.foreground': '#151b21a6',
    'breadcrumb.background': '#fff',
    'breadcrumb.foreground': '#5d646c',
    'checkbox.background': '#fff',
    'checkbox.border': '#151b2129',
    descriptionForeground: '#151b21a6',
    'diffEditor.insertedTextBackground': '#12A7A740',
    'editorGroup.border': '#151b2133',
    'editorGroup.dropBackground': '#5F656B40',
    'editorGroup.emptyBackground': '#ffffff',
    'editorGroupHeader.tabsBackground': '#DDE8F4',
    'editorSuggestWidget.selectedBackground': '#1A66AC',
    errorForeground: '#D21F28',
    focusBorder: '#151b2129',
    foreground: '#151b21d9',
    'editorCommentsWidget.unresolvedBorder': '#4d9ded',
    'gitDecoration.addedResourceForeground': '#52c41a',
    'gitDecoration.modifiedResourceForeground': '#faad14',
    'gitDecoration.deletedResourceForeground': '#fa541c',
    'gitDecoration.untrackedResourceForeground': '#13c2c2',
    'gitDecoration.ignoredResourceForeground': '#666666',
    'gitDecoration.conflictingResourceForeground': '#ff0000',
    'gitDecoration.submoduleResourceForeground': '#1785eb',
    'icon.foreground': '#151b21d9',
    'input.background': '#fff',
    'input.foreground': '#151b21',
    'input.placeholderForeground': '#151b2173',
    'inputDropdown.searchMatchForeground': '#3895EB',
    'inputIcon.foreground': '#5F656B',
    'inputValidation.errorBackground': '#321115',
    'inputValidation.errorBorder': '#D21F28',
    'inputValidation.errorForeground': '#D7DBDE',
    'inputValidation.errorText': '#D21F28',
    'inputValidation.warningBackground': '#fff',
    'inputValidation.warningBorder': '#DBA936',
    'inputValidation.warningText': '#DBA936',
    'inputValidation.warningForeground': '#151b21',
    'keybinding.background': '#5F656B33',
    'kt.accentForeground': '#FFFFFF',
    'kt.actionbar.disableForeground': '#5F656B',
    'kt.actionbar.foreground': '#151b21a6',
    'kt.actionbar.selectionBorder': '#1A66AC',
    'kt.actionbar.separatorBackground': '#5F656B40',
    'kt.activityBar.dropUpBackground': '#1F507D',
    'kt.button.disableBackground': '#151b210a',
    'kt.button.disableBorder': '#151b2114',
    'kt.button.disableForeground': '#151b2159',
    'kt.checkbox.disableBackground': '#5F656B40',
    'kt.checkbox.disableForeground': '#5F656B',
    'kt.checkbox.hoverBorder': '#167CDB',
    'kt.checkbox.selectionBackground': '#167CDB',
    'kt.checkbox.selectionForeground': '#FFFFFF',
    'kt.dangerButton.background': '#DB4345',
    'kt.dangerButton.clickBackground': '#D21F28',
    'kt.dangerButton.foreground': '#FFFFFF',
    'kt.dangerButton.hoverBackground': '#F37370',
    'kt.dangerGhostButton.border': '#DB4345',
    'kt.dangerGhostButton.clickBorder': '#D21F28',
    'kt.dangerGhostButton.clickForeground': '#D21F28',
    'kt.dangerGhostButton.foreground': '#DB4345',
    'kt.dangerGhostButton.hoverBorder': '#F37370',
    'kt.dangerGhostButton.hoverForeground': '#F37370',
    'kt.dirtyDot.foreground': '#868C91',
    'kt.disableForeground': '#5F656B',
    'kt.editorBreadcrumb.borderDown': '#e9e9e914',
    'kt.errorBackground': '#D21F2840',
    'kt.errorIconForeground': '#DB4345',
    'kt.hintBackground': '#5F656B40',
    'kt.hintIconForeground': '#868C91',
    'kt.icon.clickForeground': '#D7DBDE',
    'kt.icon.disableForeground': '#5F656B',
    'kt.icon.foreground': '#151b21a6',
    'kt.icon.hoverBackground': '#151b2114',
    'kt.icon.hoverForeground': '#151b21d9',
    'kt.icon.secondaryForeground': '#868C91',
    'kt.infoBackground': '#167CDB40',
    'kt.infoIconForeground': '#3895EB',
    'kt.input.border': '#151b2129',
    'kt.input.disableBackground': '#151b210a',
    'kt.input.disableForeground': '#151b2159',
    'kt.input.selectionBackground': '#1A66AC',
    'kt.linkButton.clickForeground': '#167CDB',
    'kt.linkButton.disableForeground': '#5F656B',
    'kt.linkButton.foreground': '#3895EB',
    'kt.linkButton.hoverForeground': '#67ABEB',
    'kt.menu.descriptionForeground': '#868C91',
    'kt.menu.disableForeground': '#5F656B',
    'kt.menubar.background': '#00000000',
    'kt.menubar.border': '#252729',
    'kt.menubar.foreground': '#D7DBDE',
    'kt.menubar.separatorBackground': '#5F656B40',
    'kt.modal.background': '#fff',
    'kt.modal.foreground': '#151b21d9',
    'kt.modal.separatorBackground': '#2C3033',
    'kt.modalErrorIcon.foreground': '#DB4345',
    'kt.modalInfoIcon.foreground': '#3895EB',
    'kt.modalSuccessIcon.foreground': '#64B436',
    'kt.modalWarningIcon.foreground': '#DBA936',
    'kt.panel.secondaryForeground': '#151b21a6',
    'kt.panelTab.activeBackground': '#fff',
    'kt.panelTab.activeForeground': '#151b21',
    'kt.panelTab.border': '#151b2114',
    'kt.panelTab.inactiveBackground': '#00000000',
    'kt.panelTab.inactiveForeground': '#151b21d9',
    'kt.panelTitle.background': '#fff',
    'kt.popover.background': '#000000e3',
    'kt.popover.border': '#000000e3',
    'kt.popover.foreground': '#fffffff2',
    'kt.popover.prominentBackground': '#2C3033',
    'kt.defaultButton.background': '#fafafb',
    'kt.defaultButton.border': '#00000000',
    'kt.defaultButton.clickBackground': '#fafafb',
    'kt.defaultButton.clickBorder': '#00000000',
    'kt.defaultButton.disableBackground': '#fff',
    'kt.defaultButton.disableBorder': '#00000000',
    'kt.defaultButton.disableForeground': '#151b2159',
    'kt.defaultButton.foreground': '#000a1aff',
    'kt.defaultButton.hoverBackground': '#F5F5F6',
    'kt.defaultButton.hoverBorder': '#00000000',
    'kt.defaultButton.selectionBackground': '#fff',
    'kt.defaultButton.selectionForeground': '#151b21',
    'kt.primaryButton.background': '#3c8dff',
    'kt.primaryButton.clickBackground': '#3c8dff',
    'kt.primaryButton.foreground': '#fff',
    'kt.primaryButton.hoverBackground': '#5b9fff',
    'kt.primaryButton.border': '#00000000',
    'kt.primaryGhostButton.clickBorder': '#3c8dff',
    'kt.primaryGhostButton.clickForeground': '#167CDB',
    'kt.primaryGhostButton.clickBackground': '#fff',
    'kt.primaryGhostButton.foreground': '#3895EB',
    'kt.primaryGhostButton.border': '#3c8dff',
    'kt.primaryGhostButton.background': '#fff',
    'kt.secondaryButton.border': '#00000026',
    'kt.secondaryButton.clickBorder': '#00000026',
    'kt.secondaryButton.clickForeground': '#151b21',
    'kt.secondaryButton.foreground': '#151b21d9',
    'kt.secondaryButton.background': '#fff',
    'kt.secondaryButton.hoverBorder': '#00000026',
    'kt.secondaryButton.hoverForeground': '#151b21',
    'kt.select.background': '#fff',
    'kt.select.border': '#151b2129',
    'kt.select.disableBackground': '#151b2114',
    'kt.select.disableForeground': '#151b2159',
    'kt.select.foreground': '#151b21',
    'kt.select.placeholderForeground': '#151b2173',
    'kt.selectDropdown.background': '#fff',
    'kt.selectDropdown.foreground': '#151b21',
    'kt.selectDropdown.hoverBackground': '#151b2114',
    'kt.selectDropdown.selectionBackground': '#151b2114',
    'kt.selectDropdown.selectionForeground': '#151b21',
    'kt.selectOption.activeBorder': '#167CDB',
    'kt.statusbar.offline.background': '#DB4345',
    'kt.successBackground': '#48A91840',
    'kt.successIconForeground': '#64B436',
    'kt.tab.activeBorder': '#167CDB',
    'kt.tab.activeForeground': '#151b21',
    'kt.tab.borderDown': '#151b211f',
    'kt.tab.inactiveForeground': '#151b21a6',
    'kt.tree.activeSelectionBackground': '#1A66AC',
    'kt.tree.activeSelectionForeground': '#FFFFFF',
    'kt.tree.hoverBackground': '#151b5814',
    'kt.tree.hoverForeground': '#151b21',
    'kt.tree.inactiveSelectionBackground': '#151b5814',
    'kt.tree.inactiveSelectionForeground': '#151b21',
    'kt.warningBackground': '#D7951340',
    'kt.warningIconForeground': '#DBA936',
    'kt.whiteGhostButton.border': '#FFFFFF',
    'kt.whiteGhostButton.clickBorder': '#FFFFFFA6',
    'kt.whiteGhostButton.clickForeground': '#FFFFFFA6',
    'kt.whiteGhostButton.disableBackground': '#FFFFFF03',
    'kt.whiteGhostButton.disableBorder': '#FFFFFF40',
    'kt.whiteGhostButton.disableForeground': '#FFFFFF40',
    'kt.whiteGhostButton.foreground': '#FFFFFF',
    'list.activeSelectionBackground': '#1A66AC',
    'list.activeSelectionForeground': '#e1e4e8',
    'list.evenItemBackground': '#5F656B14',
    'list.headerBackground': '#5F656B1F',
    'list.hoverBackground': '#151b5814',
    'menu.background': '#FFFFFF',
    'menu.foreground': '#151b21',
    'menu.selectionBackground': '#151b2114',
    'menu.selectionForeground': '#151b21',
    'menu.separatorBackground': '#151b211f',
    'menubar.selectionBackground': '#151b2114',
    'menubar.selectionForeground': '#151b21',
    'message.background': '#151b21d9',
    'message.foreground': '#D7DBDE',
    'messageErrorIcon.foreground': '#DB4345',
    'messageInfoIcon.foreground': '#3895EB',
    'messageSuccessIcon.foreground': '#64B436',
    'messageWarningIcon.foreground': '#DBA936',
    'notifications.background': '#fff',
    'notifications.foreground': '#151b21d9',
    'notificationsErrorIcon.foreground': '#DB4345',
    'notificationsInfoIcon.foreground': '#3895EB',
    'notificationsWarningIcon.foreground': '#DBA936',
    'panel.background': '#fff',
    'panel.border': '#43484D',
    'panel.foreground': '#151b21',
    'panel.selectionBackground': '#5F656B40',
    'panel.separatorBackground': '#2C3033',
    'panelMenuBadge.background': '#00000040',
    'panelMenuBar.background': '#2C3033',
    'panelMenuBarBadge.foreground': '#5F656B40',
    'panelTabBarActionIcon.Background': '#868C91',
    'panelTabBarError.foreground': '#DB4345',
    'panelTitle.activeBorder': '#3c8dff',
    'panelTitle.activeForeground': '#151b21',
    'panelTitle.hoverForeground': '#FFFFFF',
    'panelTitle.inactiveForeground': '#151b21a6',
    'selectDropdown.descriptionForeground': '#868C91',
    'selectDropdown.teamForeground': '#868C91',
    'sideBar.background': '#00000000',
    'sideBar.border': '#151b211f',
    'sideBar.dropBackground': '#43484D',
    'sideBar.dropUpBackground': '#1F507D',
    'sideBarSectionHeader.background': '#00000000',
    'sideBarSectionHeader.foreground': '#151b21d9',
    'sideBarTitle.foreground': '#151b21d9',
    'statusBar.background': '#00000000',
    'statusBar.debuggingBackground': '#D77915',
    'statusBar.foreground': '#151b21a6',
    'statusBar.noFolderBackground': '#43484D',
    'statusBarItem.activeBackground': '#FFFFFF40',
    'statusBarItem.hoverBackground': '#FFFFFF03',
    'statusBarItem.remoteBackground': '#3c8dff',
    'statusBarItem.prominentForeground': '#151b21a6',
    'statusBarItem.prominentBackground': '#f1f1f180',
    'tab.activeBackground': '#ffffff',
    'tab.activeForeground': '#151b21',
    'tab.border': '#e9e9e914',
    'tab.inactiveBackground': '#00000000',
    'tab.inactiveForeground': '#151b21d9',
    'tab.hoverBackground': '#00000000',
    'tab.unfocusedActiveBackground': '#202224',
    'tab.unfocusedActiveForeground': '#868C91',
    'tab.unfocusedInactiveForeground': '#868C91',
    'terminal.background': '#FFFFFF',
    'terminal.border': '#252729',
    'terminal.foreground': '#151b21',
    'terminal.offlineBackground': '#D21F2840',
    'terminal.offlineForeground': '#868C91',
    'terminal.offlineLinkForeground': '#3895EB',
    'terminal.selectionBackground': '#5F656B40',
    'tooltip.background': '#35393D',
    'tooltip.foreground': '#D7DBDE',
    'widget.shadow': '#00000099',
    'list.focusOutline': '#00000000',
    'editorInlayHint.parameterBackground': '#00000000',
    'button.background': '#ffffff14',
    'scrollbarSlider.background': '#151b211f',
    'editor.background': '#F1F2F3',
    'quickInput.background': '#fff',
    'list.focusBackground': '#151b5814',
    'textLink.foreground': '#3c8dff',
    'editorStickyScroll.background': '#fff',
  },
  semanticHighlighting: true,
  semanticTokenColors: {
    newOperator: '#d4d4d4',
    stringLiteral: '#ce9178',
    customLiteral: '#D4D4D4',
    numberLiteral: '#b5cea8',
  },
  encodedTokensColors: [],
  rules: [],
  base: 'vs' as BuiltinTheme,
  designThemeType: 'design-light',
  inherit: true,
  hasDefaultTokens: false,
  id: 'opensumi-design-light-theme',
  name: 'OpenSumi Design Light+ (default light)',
};
