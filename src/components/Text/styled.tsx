import styled from 'styled-components';
export const StyledText = styled.p<{
	$w: string;
	$h: string;
	$m: string[];
	$p: string[];
	$variant: string;
	$alignment: string;
}>`
	width: ${(props) => props.$w};
	height: ${(props) => props.$h};
	margin: ${(props) =>
		props.$m && props.$m.map((marginSize) => `var(--${marginSize})`).join(' ')};
	padding: ${(props) =>
		props.$p && props.$p.map((paddingSize) => `var(--${paddingSize})`).join(' ')};
	text-align: ${(props) => props.$alignment !== null && props.$alignment};
	font-family: var(--font-geist-pixel-circle);

	${(props) =>
		props.$variant === 'title' &&
		`
			font-size: var(--font-size-title);
			line-height: var(--line-height-title);
			font-weight: 500;
			color: var(--text);
	`}

	${(props) =>
		props.$variant === 'subtitle-fst' &&
		`
			font-size: var(--font-size-subtitle);
			line-height: var(--line-height-subtitle);
			font-weight: 500;
			color: var(--text);
	`}

${(props) =>
		props.$variant === 'subtitle-fst-desktop' &&
		`
			font-size: var(--font-size-title);
			line-height: var(--line-height-title);
			font-weight: 500;
			color: var(--text);
	`}

	${(props) =>
		props.$variant === 'subtitle-snd' &&
		`
			font-size: var(--font-size-subtitle-sm);
			line-height: var(--line-height-subtitle-sm);
			font-weight: 500;
			color: var(--text);
	`}

${(props) =>
		props.$variant === 'paragraph' &&
		`
			font-size: var(--font-size-body);
			font-weight: 500;
			line-height: var(--line-height-body);
			opacity: 80%;
			color: var(--text);
	`}

	${(props) =>
		props.$variant === 'paragraph-work-card' &&
		`
			font-size: var(--font-size-body-sm);
			font-weight: 500;
			line-height: var(--line-height-body-sm);
			opacity: 80%;
			color: var(--text);
	`}

${(props) =>
		props.$variant === 'paragraph-desktop' &&
		`
			text-align: start;
			font-weight: 500;
			word-spacing: 2px;
			opacity: 80%;
			color: var(--text);

			@media (min-width: 1440px) {
				& {
					font-size: var(--font-size-body);
					line-height: 1.75rem;
				}
			}

			@media (min-width: 1800px) {
				& {
					font-size: var(--font-size-subtitle-sm);
					line-height: 2rem;
				}
			}
	`}

	${(props) =>
		props.$variant === 'details-fst' &&
		`
			line-height: var(--line-height-label);
			font-size: var(--font-size-label);
			font-weight: 500;
			opacity: 80%;
			color: var(--text);

	`}

	${(props) =>
		props.$variant === 'details-snd' &&
		`
			line-height: var(--line-height-caption);
			font-size: var(--font-size-caption);
			font-weight: 500;
			color: inherit;
	`}
`;
