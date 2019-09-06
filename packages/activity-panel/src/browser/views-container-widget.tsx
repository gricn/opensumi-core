import { Widget, SplitLayout, LayoutItem, SplitPanel, PanelLayout } from '@phosphor/widgets';
import { DisposableCollection, Disposable, Event, Emitter, StorageProvider, IStorage, STORAGE_NAMESPACE } from '@ali/ide-core-common';
import * as ReactDom from 'react-dom';
import * as React from 'react';
import { ConfigProvider, AppConfig, SlotRenderer, IContextKeyService } from '@ali/ide-core-browser';
import { Injector, Injectable, Autowired, INJECTOR_TOKEN, Inject } from '@ali/common-di';
import { LoadingView } from './loading-view.view';
import { View } from '@ali/ide-core-browser/lib/layout';
import { ViewUiStateManager } from './view-container-state';
import { TabBarToolbar, TabBarToolbarRegistry } from './tab-bar-toolbar';
import { ViewContextKeyRegistry } from './view-context-key.registry';
import { SplitPositionHandler, SplitPositionOptions } from '@ali/ide-core-browser/lib/layout/split-panels';
import { MessageLoop, Message } from '@phosphor/messaging';
import { IIterator, map, toArray } from '@phosphor/algorithm';
import debounce = require('lodash.debounce');
import { LayoutState } from '@ali/ide-core-browser/lib/layout/layout-state';

const SECTION_HEADER_HEIGHT = 22;
const COLLAPSED_CLASS = 'collapse';
const EXPANSION_TOGGLE_CLASS = 'expansion-collapse';

export interface ViewContainerItem {
  id: string;
  title: string;
  icon: string;
}

export interface SectionState {
  viewId: string;
  collapsed: boolean;
  hidden: boolean;
  relativeSize?: number;
}

export interface ContainerState {
  sections: SectionState[];
}

export function createElement(className?: string): HTMLDivElement {
  const div = document.createElement('div');
  if (className) {
    div.classList.add(className);
  }
  return div;
}

@Injectable({multiple: true})
export class ViewsContainerWidget extends Widget {
  public sections: Map<string, ViewContainerSection> = new Map<string, ViewContainerSection>();
  private viewContextKeyRegistry: ViewContextKeyRegistry;
  private contextKeyService: IContextKeyService;
  public showContainerIcons: boolean;
  public containerId: string;
  public panel: SplitPanel;
  private lastState: ContainerState;

  @Autowired()
  private splitPositionHandler: SplitPositionHandler;

  @Autowired(AppConfig)
  configContext: AppConfig;

  @Autowired(INJECTOR_TOKEN)
  injector: Injector;

  @Autowired()
  uiStateManager: ViewUiStateManager;

  @Autowired()
  layoutState: LayoutState;

  constructor(@Inject(Symbol()) protected viewContainer: ViewContainerItem, @Inject(Symbol()) protected views: View[], @Inject(Symbol()) private side: 'left' | 'right' | 'bottom') {
    super();

    this.id = `views-container-widget-${viewContainer.id}`;
    this.containerId = viewContainer.id;
    this.title.caption = this.title.label = viewContainer.title;
    this.addClass('views-container');
    this.viewContextKeyRegistry = this.injector.get(ViewContextKeyRegistry);
    this.contextKeyService = this.injector.get(IContextKeyService);

    // view container也要支持额外的按钮注册，与view做merge处理
    const contextKeyService = this.viewContextKeyRegistry.registerContextKeyService(viewContainer.id, this.contextKeyService.createScoped());
    contextKeyService.createKey('view', viewContainer.id);

    this.init();

    views.forEach((view: View) => {
      if (this.hasView(view.id)) {
        return;
      }
      this.appendSection(view);
    });
    this.restoreState();
  }

  protected init() {
    const layout = new PanelLayout();
    this.layout = layout;
    this.panel = new SplitPanel({
      layout: new ViewContainerLayout({
        renderer: SplitPanel.defaultRenderer,
        orientation: 'vertical',
        spacing: 0,
        headerSize: 22,
        animationDuration: 100,
      }, this.splitPositionHandler),
    });
    this.panel.node.tabIndex = -1;
    layout.addWidget(this.panel);
  }

  async restoreState() {
    const defaultSections: SectionState[] = this.views.map((view) => {
      return {
        viewId: view.id,
        collapsed: false,
        hidden: false,
        relativeSize: view.weight,
      };
    });
    const defaultState = {
      sections: defaultSections,
    };
    this.lastState = this.layoutState.getState(`view/${this.containerId}`, defaultState);
    const relativeSizes: Array<number | undefined> = [];
    for (const section of this.sections.values()) {
      const sectionState = this.lastState.sections.find((stored) => stored.viewId === section.view.id);
      if (sectionState) {
        section.toggleOpen(sectionState.collapsed || !sectionState.relativeSize);
        // TODO 右键隐藏，canHide
        section.setHidden(sectionState.hidden);
        relativeSizes.push(sectionState.relativeSize);
      }
    }
    setTimeout(() => {
      // FIXME 时序问题，同步执行relativeSizes没有生效
      this.containerLayout.setPartSizes(relativeSizes);
      this.containerLayout.onLayoutUpdate(() => {
        this.storeState();
      });
    }, 0);
  }

  public storeState() {
    if (this.sections.size === 1) { return; }
    const availableSize = this.containerLayout.getAvailableSize();
    const state: ContainerState = {
      sections: [],
    };
    for (const section of this.sections.values()) {
      let size = this.containerLayout.getPartSize(section);
      if (size && size > SECTION_HEADER_HEIGHT) {
        size -= SECTION_HEADER_HEIGHT;
      }
      state.sections.push({
        viewId: section.view.id,
        collapsed: section.collapsed,
        hidden: section.isHidden,
        relativeSize: size && availableSize ? size / availableSize : undefined,
      });
    }
    this.layoutState.setState(`view/${this.containerId}`, state);
    return state;
  }

  get containerLayout(): ViewContainerLayout {
    return this.panel.layout as ViewContainerLayout;
  }

  public hasView(viewId: string): boolean {
    return this.sections.has(viewId);
  }

  public addWidget(view: View, component: React.FunctionComponent, props?: any) {
    const { id: viewId } = view;
    const section = this.sections.get(viewId);
    const contextKeyService = this.viewContextKeyRegistry.registerContextKeyService(viewId, this.contextKeyService.createScoped());
    contextKeyService.createKey('view', viewId);

    if (section) {
      const viewState = this.uiStateManager.getState(viewId)!;
      section.addViewComponent(component, {
        ...(props || {}),
        viewState,
        key: viewId,
      });
    } else {
      this.appendSection(view);
    }
  }

  protected updateTitleVisibility() {
    if (this.sections.size === 1) {
      const section = this.sections.values().next().value;
      section.hideTitle();
      this.showContainerIcons = true;
    } else {
      this.sections.forEach((section) => section.showTitle());
      this.showContainerIcons = false;
    }
  }

  private appendSection(view: View) {
    const section = new ViewContainerSection(view, this.configContext, this.injector, this.side);
    this.uiStateManager.initSize(view.id, this.side);
    this.sections.set(view.id, section);
    this.containerLayout.addWidget(section);
    this.updateTitleVisibility();
    setTimeout(() => {
      // FIXME 带动画resize导致的无法获取初始化高度
      this.uiStateManager.updateSize(view.id, section.contentHeight);
    }, 0);
    section.onCollapseChange(() => {
      this.containerLayout.updateCollapsed(section, true, () => {
        this.uiStateManager.updateSize(view.id, section.contentHeight);
      });
    });
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this.update();
  }

  onUpdateRequest(msg: Message) {
    super.onUpdateRequest(msg);
    this.sections.forEach((section: ViewContainerSection) => {
      if (section.opened) {
        section.update();
      }
    });
  }

}

export class ViewContainerSection extends Widget implements ViewContainerPart {
  animatedSize?: number;
  uncollapsedSize?: number;

  node: HTMLDivElement;
  header: HTMLDivElement;
  control: HTMLDivElement;
  titleContainer: HTMLDivElement;
  content: HTMLDivElement;
  private uiStateManager: ViewUiStateManager;
  private toolBar: TabBarToolbar;

  private viewComponent: React.FunctionComponent;

  protected readonly collapsedEmitter = new Emitter<boolean>();
  public onCollapseChange: Event<boolean> = this.collapsedEmitter.event;

  constructor(public view: View, private configContext: AppConfig, private injector: Injector, private side: string, private options?) {
    super(options);
    this.addClass('views-container-section');
    this.createToolBar();
    this.createTitle();
    this.createContent();
    this.uiStateManager = this.injector.get(ViewUiStateManager);
  }

  get contentHeight() {
    return this.content.clientHeight;
  }

  onResize() {
    if (this.opened) {
      this.uiStateManager.updateSize(this.view.id, this.contentHeight);
    }
  }

  createTitle(): void {
    this.header = createElement('views-container-section-title');
    this.header.style.height = SECTION_HEADER_HEIGHT + 'px';
    this.node.appendChild(this.header);

    this.control = createElement(EXPANSION_TOGGLE_CLASS);
    this.header.appendChild(this.control);

    this.titleContainer = createElement('views-container-section-label');
    this.titleContainer.innerText = this.view.name || this.view.id;
    this.header.appendChild(this.titleContainer);
    this.header.appendChild(this.toolBar.node);

    this.header.addEventListener('click', (event) => {
      if (!(event.target as HTMLElement).classList.contains('action-icon')) {
        this.toggleOpen();
      }
    });
  }

  createToolBar(): void {
    this.toolBar = this.injector.get(TabBarToolbar);
  }

  protected updateToolbar(forceHide?: boolean): void {
    if (!this.toolBar) {
      return;
    }
    const tabBarToolbarRegistry = this.injector.get(TabBarToolbarRegistry);
    const items = forceHide ? [] : tabBarToolbarRegistry.visibleItems(this.view.id);
    this.toolBar.updateItems(items, undefined);
  }

  hideTitle(): void {
    this.header.classList.add('p-mod-hidden');
  }

  showTitle(): void {
    this.header.classList.remove('p-mod-hidden');
  }

  createContent(): void {
    this.content = createElement('views-container-section-content');
    this.node.appendChild(this.content);
    ReactDom.render(
      <ConfigProvider value={this.configContext} >
        <SlotRenderer Component={LoadingView} />
      </ConfigProvider>, this.content);
  }

  get opened(): boolean {
    const opened = !this.control.classList.contains(COLLAPSED_CLASS);
    return opened;
  }

  get collapsed(): boolean {
    return !this.opened;
  }

  get minSize(): number {
    const style = getComputedStyle(this.content);
    return parseCssMagnitude(style.minHeight, 0);
  }

  protected toDisposeOnOpen = new DisposableCollection();
  toggleOpen(hide?: boolean): void {
    const prevStatus = this.opened;
    switch (hide) {
      case true:
        this.control.classList.add(COLLAPSED_CLASS);
        break;
      case false:
        this.control.classList.remove(COLLAPSED_CLASS);
        break;
      default:
        this.control.classList.toggle(COLLAPSED_CLASS);
    }
    if (this.opened) {
      this.toDisposeOnOpen.dispose();
    } else {
      const display = this.content.style.display;
      this.content.style.display = 'none';
      this.toDisposeOnOpen.push(Disposable.create(() => this.content.style.display = display));
    }
    if (this.opened !== prevStatus) {
      this.collapsedEmitter.fire(this.collapsed);
      this.update();
    }
  }

  addViewComponent(viewComponent: React.FunctionComponent, props: any = {}): void {
    this.viewComponent = viewComponent;
    ReactDom.unmountComponentAtNode(this.content);
    ReactDom.render(
      <ConfigProvider value={this.configContext} >
        <SlotRenderer Component={viewComponent} initialProps={{
          injector: this.configContext.injector,
          ...props,
        }} />
      </ConfigProvider>, this.content);
    this.update();
  }

  update(): void {
    if (this.opened && this.viewComponent) {
      this.updateToolbar();
    } else {
      this.updateToolbar(true);
    }
  }
}

export interface ViewContainerPart extends Widget {
  minSize: number;
  animatedSize?: number;
  collapsed: boolean;
  uncollapsedSize?: number;
}

export class ViewContainerLayout extends SplitLayout {
  constructor(protected options: ViewContainerLayout.Options, protected readonly splitPositionHandler: SplitPositionHandler) {
    super(options);
  }

  protected readonly layoutUpdateEmitter = new Emitter<void>();
  public onLayoutUpdate: Event<void> = this.layoutUpdateEmitter.event;

  protected get items(): ReadonlyArray<LayoutItem & ViewContainerLayout.Item> {
    // tslint:disable-next-line:no-any
    return (this as any)._items as Array<LayoutItem & ViewContainerLayout.Item>;
  }

  iter(): IIterator<ViewContainerPart> {
    return map(this.items, (item) => item.widget);
  }

  get widgets(): ViewContainerPart[] {
    return toArray(this.iter());
  }

  moveWidget(fromIndex: number, toIndex: number, widget: Widget): void {
    const ref = this.widgets[toIndex < fromIndex ? toIndex : toIndex + 1];
    super.moveWidget(fromIndex, toIndex, widget);
    if (ref) {
      this.parent!.node.insertBefore(this.handles[toIndex], ref.node);
    } else {
      this.parent!.node.appendChild(this.handles[toIndex]);
    }
    MessageLoop.sendMessage(widget, Widget.Msg.BeforeDetach);
    this.parent!.node.removeChild(widget.node);
    MessageLoop.sendMessage(widget, Widget.Msg.AfterDetach);

    MessageLoop.sendMessage(widget, Widget.Msg.BeforeAttach);
    this.parent!.node.insertBefore(widget.node, this.handles[toIndex]);
    MessageLoop.sendMessage(widget, Widget.Msg.AfterAttach);
  }

  getPartSize(part: ViewContainerPart): number | undefined {
    if (part.collapsed || part.isHidden) {
      return part.uncollapsedSize;
    }
    return part.node.offsetHeight;
  }

  /**
   * Set the sizes of the view container parts according to the given weights
   * by moving the split handles. This is similar to `setRelativeSizes` defined
   * in `SplitLayout`, but here we properly consider the collapsed / expanded state.
   */
  setPartSizes(weights: (number | undefined)[]): void {
    const parts = this.widgets;
    const availableSize = this.getAvailableSize();

    // Sum up the weights of visible parts
    let totalWeight = 0;
    let weightCount = 0;
    for (let index = 0; index < weights.length && index < parts.length; index++) {
      const part = parts[index];
      const weight = weights[index];
      if (weight && !part.isHidden && !part.collapsed) {
        totalWeight += weight;
        weightCount++;
      }
    }
    if (weightCount === 0 || availableSize === 0) {
      return;
    }

    // Add the average weight for visible parts without weight
    const averageWeight = totalWeight / weightCount;
    for (let index = 0; index < weights.length && index < parts.length; index++) {
      const part = parts[index];
      const weight = weights[index];
      if (!weight && !part.isHidden && !part.collapsed) {
        totalWeight += averageWeight;
      }
    }

    // Apply the weights to compute actual sizes
    let position = 0;
    for (let index = 0; index < weights.length && index < parts.length - 1; index++) {
      const part = parts[index];
      if (!part.isHidden) {
        position += this.options.headerSize;
        const weight = weights[index];
        if (part.collapsed) {
          if (weight) {
            part.uncollapsedSize = weight / totalWeight * availableSize;
          }
        } else {
          let contentSize = (weight || averageWeight) / totalWeight * availableSize;
          const minSize = part.minSize;
          if (contentSize < minSize) {
            contentSize = minSize;
          }
          position += contentSize;
        }
        this.setHandlePosition(index, position);
        position += this.spacing;
      }
    }
  }

  /**
   * Determine the size of the split panel area that is available for widget content,
   * i.e. excluding part headers and split handles.
   */
  getAvailableSize(): number {
    if (!this.parent || !this.parent.isAttached) {
      return 0;
    }
    const parts = this.widgets;
    const visiblePartCount = parts.filter((part) => !part.isHidden).length;
    let availableSize: number;
    availableSize = this.parent.node.offsetHeight;
    availableSize -= visiblePartCount * this.options.headerSize;
    availableSize -= (visiblePartCount - 1) * this.spacing;
    if (availableSize < 0) {
      return 0;
    }
    return availableSize;
  }

  /**
   * Update a view container part that has been collapsed or expanded. The transition
   * to the new state is animated.
   */
  updateCollapsed(part: ViewContainerPart, enableAnimation: boolean, callback?: () => void): void {
    const index = this.items.findIndex((item) => item.widget === part);
    if (index < 0 || !this.parent || part.isHidden) {
      return;
    }

    // Do not store the height of the "stretched item". Otherwise, we mess up the "hint height".
    // Store the height only if there are other expanded items.
    const currentSize = part.node.offsetHeight;
    if (part.collapsed && this.items.some((item) => !item.widget.collapsed && !item.widget.isHidden)) {
      part.uncollapsedSize = currentSize;
    }

    if (!enableAnimation || this.options.animationDuration <= 0) {
      MessageLoop.postMessage(this.parent!, Widget.Msg.FitRequest);
      return;
    }
    let startTime: number | undefined;
    const duration = this.options.animationDuration;
    const direction = part.collapsed ? 'collapse' : 'expand';
    let fullSize: number;
    if (direction === 'collapse') {
      fullSize = currentSize - this.options.headerSize;
    } else {
      fullSize = Math.max((part.uncollapsedSize || 0) - this.options.headerSize, part.minSize);
      if (this.items.filter((item) => !item.widget.collapsed && !item.widget.isHidden).length === 1) {
        // Expand to full available size
        fullSize = Math.max(fullSize, this.getAvailableSize());
      }
    }

    // The update function is called on every animation frame until the predefined duration has elapsed.
    const updateFunc = (time: number) => {
      if (startTime === undefined) {
        startTime = time;
      }
      if (time - startTime < duration) {
        // Render an intermediate state for the animation
        const t = this.tween((time - startTime) / duration);
        if (direction === 'collapse') {
          part.animatedSize = (1 - t) * fullSize;
        } else {
          part.animatedSize = t * fullSize;
        }
        requestAnimationFrame(updateFunc);
      } else {
        // The animation is finished
        if (direction === 'collapse') {
          part.animatedSize = undefined;
          if (callback) { callback(); }
        } else {
          part.animatedSize = fullSize;
          // Request another frame to reset the part to variable size
          requestAnimationFrame(() => {
            part.animatedSize = undefined;
            MessageLoop.sendMessage(this.parent!, Widget.Msg.FitRequest);
            if (callback) { callback(); }
          });
        }
      }
      MessageLoop.sendMessage(this.parent!, Widget.Msg.FitRequest);
    };
    requestAnimationFrame(updateFunc);
  }

  protected onFitRequest(msg: Message): void {
    for (const part of this.widgets) {
      const style = part.node.style;
      if (part.animatedSize !== undefined) {
        // The part size has been fixed for animating the transition to collapsed / expanded state
        const fixedSize = `${this.options.headerSize + part.animatedSize}px`;
        style.minHeight = fixedSize;
        style.maxHeight = fixedSize;
      } else if (part.collapsed) {
        // The part size is fixed to the header size
        const fixedSize = `${this.options.headerSize}px`;
        style.minHeight = fixedSize;
        style.maxHeight = fixedSize;
      } else {
        const minSize = `${this.options.headerSize + part.minSize}px`;
        style.minHeight = minSize;
        // tslint:disable-next-line:no-null-keyword
        style.maxHeight = null;
      }
    }
    super.onFitRequest(msg);
  }

  private debounceUpdate: any = debounce(() => {
    this.layoutUpdateEmitter.fire();
  }, 200);

  onUpdateRequest(msg) {
    this.debounceUpdate();
    super.onUpdateRequest(msg);
  }
  /**
   * Sinusoidal tween function for smooth animation.
   */
  protected tween(t: number): number {
    return 0.5 * (1 - Math.cos(Math.PI * t));
  }

  setHandlePosition(index: number, position: number): Promise<void> {
    const options: SplitPositionOptions = {
      referenceWidget: this.widgets[index],
      duration: 0,
    };
    // tslint:disable-next-line:no-any
    return this.splitPositionHandler.setSplitHandlePosition(this.parent as SplitPanel, index, position, options) as Promise<any>;
  }

}

export namespace ViewContainerLayout {

  export interface Options extends SplitLayout.IOptions {
    headerSize: number;
    animationDuration: number;
  }

  export interface Item {
    readonly widget: ViewContainerPart;
  }

}
/**
 * Parse a magnitude value (e.g. width, height, left, top) from a CSS attribute value.
 * Returns the given default value (or undefined) if the value cannot be determined,
 * e.g. because it is a relative value like `50%` or `auto`.
 */
export function parseCssMagnitude(value: string | null, defaultValue: number): number;
export function parseCssMagnitude(value: string | null, defaultValue?: number): number | undefined {
  if (value) {
    let parsed: number;
    if (value.endsWith('px')) {
      parsed = parseFloat(value.substring(0, value.length - 2));
    } else {
      parsed = parseFloat(value);
    }
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  return defaultValue;
}
