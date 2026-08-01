import type { ComponentType } from 'react';

//* Demos
import * as Foundations from './demos/foundations';
import * as Feedback from './demos/feedback';
import * as TextMotion from './demos/text';
import * as Overlays from './demos/overlays';
import * as Navigation from './demos/navigation';
import * as Lists from './demos/lists';
import * as Forms from './demos/forms';
import * as Scroll from './demos/scroll';
import * as Gestures from './demos/gestures';

export type DesignSystemEntry = {
	/** Anchor id — also the deep link, e.g. /design-system#copy-button. */
	slug: string;
	name: string;
	/** What problem the component removes. Kept to one sentence. */
	note: string;
	demo: ComponentType;
	/** Stretch for components that need the full preview width. */
	align?: 'center' | 'stretch';
	/** Marks a component that extends something already in the DS. */
	extends?: string;
};

export type DesignSystemCategory = {
	id: string;
	title: string;
	entries: DesignSystemEntry[];
};

export const CATEGORIES: DesignSystemCategory[] = [
	{
		id: 'foundations',
		title: 'Foundations & variants',
		entries: [
			{
				slug: 'control-sizes',
				name: 'Control sizes',
				note: 'Four sizes traced back to the landing rather than invented here: xs is the Pill, sm the glass Button, md the default Button. An icon-only control squares off at the same height instead of jumping to a width no other control uses.',
				demo: Foundations.ControlSizesDemo,
				align: 'stretch',
			},
			{
				slug: 'control-tones',
				name: 'Control tones',
				note: 'Six tones written purely in theme tokens, so light and dark follow without a second definition. Default and glass mirror the landing button; ghost, solid, danger and success fill the gaps it never needed.',
				demo: Foundations.ControlTonesDemo,
				align: 'stretch',
			},
			{
				slug: 'landing-parity',
				name: 'Landing parity',
				note: 'The landing controls and the ported ones on one row. Alone each looks fine; side by side is the only place a drift in height or padding actually shows.',
				demo: Foundations.LandingParityDemo,
				align: 'stretch',
			},
			{
				slug: 'surface-density',
				name: 'Surface density',
				note: 'Container padding at three densities, with base set to the landing card. The ported set had drifted to 16 and 24, which is what made two systems visible on one page.',
				demo: Foundations.SurfaceDensityDemo,
				align: 'stretch',
			},
			{
				slug: 'sized-components',
				name: 'Sized components',
				note: 'The size and tone props reaching real components rather than a swatch sheet — tabs at two sizes, and a loading button at every size plus a semantic tone.',
				demo: Foundations.SizedComponentsDemo,
				align: 'stretch',
			},
			{
				slug: 'progress-variants',
				name: 'Progress variants',
				note: 'Status is carried by a token, so the same bar reads as success or danger in either theme. Thickness is a separate axis from tone.',
				demo: Foundations.ProgressVariantsDemo,
				align: 'stretch',
			},
		],
	},
	{
		id: 'feedback',
		title: 'Feedback & status',
		entries: [
			{
				slug: 'copy-button',
				name: 'Copy button',
				note: 'Every label the button can show is measured before the copy happens, so confirming never resizes the control under the cursor. The tick draws on instead of fading in.',
				demo: Feedback.CopyButtonDemo,
			},
			{
				slug: 'loading-button',
				name: 'Loading button',
				note: 'All four states are stacked so the button is already as wide as its longest one. A stale run cannot overwrite a newer result, and a second press while pending is not a second action.',
				demo: Feedback.LoadingButtonDemo,
			},
			{
				slug: 'like-burst',
				name: 'Like burst',
				note: 'The UI updates on press, the request waits for you to stop tapping, and toggling back to where you started sends nothing at all. A failure rolls back to the last confirmed truth.',
				demo: Feedback.LikeBurstDemo,
			},
			{
				slug: 'hold-to-confirm',
				name: 'Hold to confirm',
				note: 'Letting go drains the meter instead of resetting it, so a brief slip does not throw away the hold while a deliberate release visibly undoes it. Frame deltas are capped so a stutter cannot leap it forward.',
				demo: Feedback.HoldToConfirmDemo,
			},
			{
				slug: 'long-press',
				name: 'Long press',
				note: 'The label fills in as its own progress bar. Lifting, dragging away, losing the window or hiding the tab all abandon the hold, and the click that ends it is swallowed.',
				demo: Feedback.LongPressDemo,
			},
			{
				slug: 'progress-bar',
				name: 'Progress bar',
				note: 'Determinate and indeterminate states share one reserved row, so a job that starts unmeasured and later reports a percentage never reflows the layout around it.',
				demo: Feedback.ProgressBarDemo,
				align: 'stretch',
			},
			{
				slug: 'press-depth',
				name: 'Press depth',
				note: 'The cap travels down to a real bottom lip and leans toward the finger. Losing focus, hiding the tab or dragging off the button all release it, so it cannot stick.',
				demo: Feedback.PressDepthDemo,
			},
			{
				slug: 'ripple',
				name: 'Ripple',
				note: 'Each ripple scales to the furthest corner from where it was pressed and is guaranteed a minimum visible life, so a fast tap still gets an answer.',
				demo: Feedback.RippleDemo,
			},
			{
				slug: 'value-flash',
				name: 'Value flash',
				note: 'Digits roll in the direction the number moved, so the motion carries the sign before the colour does. Rapid changes are debounced before being announced.',
				demo: Feedback.ValueFlashDemo,
			},
			{
				slug: 'live-activity',
				name: 'Live activity',
				note: 'Success dismisses itself — a finished job has nothing left to say. Failure does not, because an error that disappears on its own is an error nobody read.',
				demo: Feedback.LiveActivityDemo,
				align: 'stretch',
			},
			{
				slug: 'skeleton-swap',
				name: 'Skeleton swap',
				extends: 'Skeleton',
				note: 'Extends the existing Skeleton primitive with the swap itself: content that loads fast never shows a placeholder, and one that does show stays long enough to be read.',
				demo: Feedback.SkeletonSwapDemo,
				align: 'stretch',
			},
		],
	},
	{
		id: 'text',
		title: 'Text & motion',
		entries: [
			{
				slug: 'text-reveal',
				name: 'Text reveal',
				note: 'Words stagger in on scroll, but the stagger shrinks as the text grows so a long paragraph never outlasts its budget. Assistive tech reads the whole string, not the fragments.',
				demo: TextMotion.TextRevealDemo,
				align: 'stretch',
			},
			{
				slug: 'icon-morph',
				name: 'Icon morph',
				note: 'One icon becomes another by interpolating the path itself. Shapes with fewer strokes grow theirs out of the centre instead of popping in.',
				demo: TextMotion.IconMorphDemo,
			},
			{
				slug: 'streaming-text',
				name: 'Streaming text',
				note: 'The finished paragraph is rendered invisibly underneath, so the block is already its final size before the first character lands. Announced once complete, not character by character.',
				demo: TextMotion.StreamingTextDemo,
				align: 'stretch',
			},
			{
				slug: 'typing-indicator',
				name: 'Typing indicator',
				note: 'A single tween drives all three dots so they cannot drift out of phase. The bubble survives a minimum visible time, so one keystroke does not produce a one-frame flash.',
				demo: TextMotion.TypingIndicatorDemo,
				align: 'stretch',
			},
		],
	},
	{
		id: 'overlays',
		title: 'Overlays',
		entries: [
			{
				slug: 'modal',
				name: 'Modal',
				note: 'Focus is trapped and restored, siblings go inert, Escape only reaches the topmost dialog, and Lenis is stopped alongside the native scroll lock so the page cannot drift underneath.',
				demo: Overlays.ModalDemo,
			},
			{
				slug: 'dropdown',
				name: 'Dropdown',
				note: 'Active-descendant instead of moving DOM focus, so typeahead keeps working after the first keystroke. One highlight slides between rows rather than each row flashing its own.',
				demo: Overlays.DropdownDemo,
			},
			{
				slug: 'drawer',
				name: 'Drawer',
				note: 'The drag is asymmetric on purpose: closing tracks your finger 1:1, opening further is rubber-banded. Dismissal is earned by distance or by velocity, so a flick works too.',
				demo: Overlays.DrawerDemo,
			},
			{
				slug: 'context-menu',
				name: 'Context menu',
				note: 'Height is computed from the item list rather than measured after paint, so it lands correctly on the first frame. Scales out of the exact point you aimed at.',
				demo: Overlays.ContextMenuDemo,
			},
			{
				slug: 'command-palette',
				name: 'Command palette',
				note: 'Subsequence scoring with streak and word-boundary bonuses, so "gtd" finds "Go to definition". A stationary cursor cannot steal the highlight back from the keyboard.',
				demo: Overlays.CommandPaletteDemo,
			},
			{
				slug: 'tooltip-group',
				name: 'Tooltip group',
				extends: 'Tooltip',
				note: 'One shared timer: the first tooltip waits, then the group is warm and its neighbours open instantly. Scanning a toolbar stops being a series of separate waits.',
				demo: Overlays.TooltipGroupDemo,
			},
			{
				slug: 'popover',
				name: 'Popover',
				note: 'Flips to the opposite side when the preferred one will not hold it, clamps inside the viewport, and scales out of its arrow instead of its own centre.',
				demo: Overlays.PopoverDemo,
			},
		],
	},
	{
		id: 'navigation',
		title: 'Navigation',
		entries: [
			{
				slug: 'wizard-steps',
				note: 'You can jump back to any step reached but never forward past one you have not, so the sequence still means something while staying reversible. Focus follows whichever control moved you.',
				name: 'Wizard steps',
				demo: Navigation.WizardStepsDemo,
				align: 'stretch',
			},
			{
				slug: 'scroll-spy',
				name: 'Scroll spy',
				note: 'The detection line slides down as you scroll, so the last section is actually reachable — a fixed line can never select it. Clicking pins the target until the scroll lands.',
				demo: Navigation.ScrollSpyDemo,
				align: 'stretch',
			},
			{
				slug: 'task-steps',
				name: 'Task steps',
				note: 'Every status is derived from one cursor, so the list can never show two active steps or a done step after a pending one. The active label carries its own highlight instead of a second spinner.',
				demo: Navigation.TaskStepsDemo,
				align: 'stretch',
			},
			{
				slug: 'collapsible-banner',
				name: 'Collapsible banner',
				note: 'Folding and dismissing are separate states, because they are separate intentions. Escape folds — the cheaper and more reversible of the two.',
				demo: Navigation.CollapsibleBannerDemo,
				align: 'stretch',
			},
			{
				slug: 'segmented-control',
				name: 'Segmented control',
				extends: 'ToggleGroup',
				note: 'The labels are drawn twice and the thumb clips the inverted copy, so text straddling its edge inverts exactly at that edge rather than a frame late.',
				demo: Navigation.SegmentedControlDemo,
			},
			{
				slug: 'tabs',
				name: 'Tabs',
				note: 'The indicator is measured from the real tab rather than computed, so it survives a font swap. Each label reserves its selected width, so going bold never shifts its neighbours.',
				demo: Navigation.TabsDemo,
				align: 'stretch',
			},
		],
	},
	{
		id: 'forms',
		title: 'Forms & input',
		entries: [
			{
				slug: 'floating-label',
				name: 'Floating label',
				note: 'A field that arrives already filled renders with its label raised instead of animating it up, which would suggest the value was just typed. The counter reserves its widest reading.',
				demo: Forms.FloatingLabelDemo,
				align: 'stretch',
			},
			{
				slug: 'tag-input',
				name: 'Tag input',
				note: 'A refused tag says why, and a duplicate flashes the one that already exists so you can see what blocked it. Backspace arms the last tag before removing it.',
				demo: Forms.TagInputDemo,
				align: 'stretch',
			},
			{
				slug: 'expanding-search',
				name: 'Expanding search',
				note: 'Blur only collapses an empty field — someone who typed a query and clicked away has not abandoned it. Enter flushes the pending search instead of firing a second one.',
				demo: Forms.ExpandingSearchDemo,
				align: 'stretch',
			},
			{
				slug: 'password-strength',
				note: 'A recognised pattern is pinned to the lowest score regardless of which rules it passes — "Password123!" satisfies all four and is still terrible.',
				name: 'Password strength',
				demo: Forms.PasswordStrengthDemo,
				align: 'stretch',
			},
			{
				slug: 'otp-input',
				name: 'OTP input',
				note: 'Pasting a full code fills every box from wherever it landed, only the first cell claims one-time-code so SMS autofill works, and focusing past a gap redirects to it.',
				demo: Forms.OtpInputDemo,
			},
			{
				slug: 'inline-validation',
				name: 'Inline validation',
				note: 'Validation waits for the first blur, then reports success instantly and failure only after a pause. The message row is pre-reserved so an error never pushes the form down.',
				demo: Forms.InlineValidationDemo,
				align: 'stretch',
			},
		],
	},
	{
		id: 'lists',
		title: 'Lists & data',
		entries: [
			{
				slug: 'accordion',
				name: 'Accordion',
				note: 'Height is measured with a ResizeObserver instead of animated to auto, and a collapsed panel goes inert so it stops leaving invisible tab stops behind.',
				demo: Lists.AccordionDemo,
				align: 'stretch',
			},
			{
				slug: 'show-more',
				name: 'Show more',
				note: 'The clamp lands on a real line boundary because the line height is measured, not assumed. Content that barely overflows offers no toggle at all.',
				demo: Lists.ShowMoreDemo,
				align: 'stretch',
			},
			{
				slug: 'tree-view',
				name: 'Tree view',
				note: 'Arrow keys move through the flattened visible order, so collapsed branches simply are not in it. Right opens then steps in, left closes then climbs — the standard tree contract.',
				demo: Lists.TreeViewDemo,
				align: 'stretch',
			},
			{
				slug: 'poll-results',
				name: 'Poll results',
				note: 'Bars grow by clip rather than width, so the rounded end never squashes. The winner tick waits for every bar to land, confirming a result instead of predicting one.',
				demo: Lists.PollResultsDemo,
				align: 'stretch',
			},
			{
				slug: 'pagination',
				name: 'Pagination',
				note: 'The window is a fixed width in every arrangement, so the control never resizes as the page moves and the ellipsis only appears where it actually saves space.',
				demo: Lists.PaginationDemo,
			},
			{
				slug: 'filter-grid',
				name: 'Filter grid',
				note: 'Every filter is counted up front, so a tab that would show nothing says so before you press it. Surviving cells travel to their new slots instead of being redrawn.',
				demo: Lists.FilterGridDemo,
				align: 'stretch',
			},
			{
				slug: 'sortable-table',
				name: 'Sortable table',
				note: 'Stable ties, blanks always last regardless of direction, and Intl.Collator so "item 2" precedes "item 10". A third click restores the original order.',
				demo: Lists.SortableTableDemo,
				align: 'stretch',
			},
			{
				slug: 'load-more',
				name: 'Load more',
				note: 'Auto-loading pauses after a few pages so the footer stays reachable, and scrolling away refreshes that budget. An error blocks retries until you ask for one.',
				demo: Lists.LoadMoreDemo,
				align: 'stretch',
			},
			{
				slug: 'new-items-pill',
				name: 'New items pill',
				note: 'A reader who has scrolled away is never moved: their position is corrected by the height of whatever was inserted, so the row they were reading stays put and arrivals become a count.',
				demo: Lists.NewItemsPillDemo,
				align: 'stretch',
			},
			{
				slug: 'presence-avatars',
				name: 'Presence avatars',
				note: 'Arrival order is remembered, so a roster that re-sorts server-side does not reshuffle the faces on screen. Initials sit underneath, so a slow image never leaves an empty circle.',
				demo: Lists.PresenceAvatarsDemo,
			},
		],
	},
	{
		id: 'gestures',
		title: 'Gestures & media',
		entries: [
			{
				slug: 'slider-detents',
				name: 'Slider detents',
				note: 'Marked values magnetically capture the thumb within a radius, so meaningful settings are easy to hit — but everything between still moves in ordinary steps.',
				demo: Gestures.SliderDetentsDemo,
				align: 'stretch',
			},
			{
				slug: 'reorder-list',
				name: 'Reorder list',
				note: 'The keyboard model mirrors the drag exactly — Space grabs, arrows move, Escape restores the order from before the grab. Rows swap when the pointer crosses their midpoint.',
				demo: Gestures.ReorderListDemo,
				align: 'stretch',
			},
			{
				slug: 'snap-carousel',
				name: 'Snap carousel',
				note: 'The landing slide is chosen from position plus momentum, so a short fast flick and a long slow drag mean different things. Off-screen slides leave the tab order.',
				demo: Gestures.SnapCarouselDemo,
				align: 'stretch',
			},
			{
				slug: 'swipe-deck',
				name: 'Swipe deck',
				note: 'A decision is earned by distance or by velocity — a deliberate drag and a flick are different gestures. Every decision is also available from the keyboard.',
				demo: Gestures.SwipeDeckDemo,
				align: 'stretch',
			},
			{
				slug: 'lightbox',
				name: 'Lightbox',
				extends: 'Lightbox',
				note: 'A controlled sibling of the app-level viewer, for galleries whose open state is local. Neighbouring images are preloaded, so paging never flashes an empty frame.',
				demo: Gestures.LightboxDemo,
			},
		],
	},
	{
		id: 'scroll',
		title: 'Scroll & layout',
		entries: [
			{
				slug: 'reading-progress',
				name: 'Reading progress',
				note: 'Progress is quantised into steps rather than tracked per pixel, and content that grows after load recomputes the total travel instead of trusting the height measured on mount.',
				demo: Scroll.ReadingProgressDemo,
				align: 'stretch',
			},
			{
				slug: 'hide-on-scroll',
				name: 'Hide on scroll',
				note: 'Direction is accumulated and reset on every flip, so trackpad jitter cannot flap the bar. Focus inside it pins it open rather than stranding the focus ring off screen.',
				demo: Scroll.HideOnScrollDemo,
				align: 'stretch',
			},
			{
				slug: 'logo-marquee',
				name: 'Logo marquee',
				note: 'Speed eases toward its target rather than switching, so hovering slows the strip to a stop. Only one copy is real — the duplicates hide the seam and stay out of the tab order.',
				demo: Scroll.LogoMarqueeDemo,
				align: 'stretch',
			},
			{
				slug: 'sticky-header',
				name: 'Sticky header',
				note: 'Plate, rule and both titles are driven from one smoothed number, so they cannot drift apart mid-scroll. The compact title only arrives after the expanded one has gone.',
				demo: Scroll.StickyHeaderDemo,
				align: 'stretch',
			},
			{
				slug: 'blur-up-image',
				name: 'Blur-up image',
				note: 'The aspect ratio is reserved before the request starts, and decode() is awaited before revealing. A cached image appears instantly — it never loaded, so nothing should animate.',
				demo: Scroll.BlurUpImageDemo,
			},
		],
	},
];

export const TOTAL_COMPONENTS = CATEGORIES.reduce(
	(total, category) => total + category.entries.length,
	0,
);
