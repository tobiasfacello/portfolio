import { memo } from 'react';
import { iconRegistry, type IconName } from './icons';

export type IconProps = React.SVGProps<SVGSVGElement> & {
	name: IconName;
	size?: number | string;
};

/**
 * Generic Icon component that renders SVGs from the centralized icon registry.
 *
 * @example
 * <Icon name="react" />
 * <Icon name="github" size={24} />
 * <Icon name="externalLink" className="my-icon" />
 */
function Icon({ name, size, ...svgProps }: IconProps) {
	const SvgComponent = iconRegistry[name];

	if (!SvgComponent) return null;

	const sizeProps = size != null
		? { width: size, height: size }
		: {};

	return <SvgComponent {...sizeProps} {...svgProps} />;
}

const MemoizedIcon = memo(Icon);
MemoizedIcon.displayName = 'Icon';

export default MemoizedIcon;

// Re-exported from ./icons for convenience — these are non-component exports
// eslint-disable-next-line react-refresh/only-export-components
export { iconRegistry, type IconName } from './icons';
