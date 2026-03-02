import styled, { css } from 'styled-components';
import { spacingArray } from '../../styles/mixins';
import { mq } from '../../config/breakpoints';
import type { TextVariant } from '../../types';

type VariantConfig = {
	fontSize: string;
	lineHeight: string;
	opacity?: string;
	color?: string;
	extra?: ReturnType<typeof css>;
};

const variants: Record<TextVariant, VariantConfig> = {
	title: {
		fontSize: 'var(--font-size-title)',
		lineHeight: 'var(--line-height-title)',
	},
	subtitle: {
		fontSize: 'var(--font-size-subtitle)',
		lineHeight: 'var(--line-height-subtitle)',
	},
	'subtitle-sm': {
		fontSize: 'var(--font-size-subtitle-sm)',
		lineHeight: 'var(--line-height-subtitle-sm)',
	},
	body: {
		fontSize: 'var(--font-size-body)',
		lineHeight: 'var(--line-height-body)',
		opacity: 'var(--opacity-medium)',
	},
	'body-sm': {
		fontSize: 'var(--font-size-body-sm)',
		lineHeight: 'var(--line-height-body-sm)',
		opacity: 'var(--opacity-medium)',
	},
	label: {
		fontSize: 'var(--font-size-label)',
		lineHeight: 'var(--line-height-label)',
		opacity: 'var(--opacity-medium)',
	},
	'body-lg': {
		fontSize: 'var(--font-size-body)',
		lineHeight: 'var(--line-height-body)',
		opacity: 'var(--opacity-medium)',
		extra: css`
			word-spacing: 2px;

			${mq.up('desktop-lg')} {
				font-size: var(--font-size-body);
				line-height: 1.75rem;
			}

			${mq.up(1800)} {
				font-size: var(--font-size-subtitle-sm);
				line-height: 2rem;
			}
		`,
	},
	caption: {
		fontSize: 'var(--font-size-caption)',
		lineHeight: 'var(--line-height-caption)',
		color: 'inherit',
	},
};

const applyVariant = (variant: TextVariant | undefined) => {
	if (!variant) return '';
	const config = variants[variant];
	if (!config) return '';

	return css`
		font-size: ${config.fontSize};
		line-height: ${config.lineHeight};
		${config.opacity ? `opacity: ${config.opacity};` : ''}
		${config.color ? `color: ${config.color};` : ''}
		${config.extra || ''}
	`;
};

export const StyledText = styled.p<{
	$w?: string;
	$h?: string;
	$m?: string[];
	$p?: string[];
	$variant?: TextVariant;
	$alignment?: string;
}>`
	width: ${(props) => props.$w};
	height: ${(props) => props.$h};
	margin: ${(props) => spacingArray(props.$m)};
	padding: ${(props) => spacingArray(props.$p)};
	text-align: ${(props) => props.$alignment};
	font-family: var(--font-geist-pixel-circle);
	font-weight: var(--font-weight-medium);
	color: var(--text);

	${(props) => applyVariant(props.$variant)}
`;
