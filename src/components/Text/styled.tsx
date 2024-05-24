import styled from "styled-components";
export const StyledText = styled.p<{
	variant: string;
	alignment: string;
	m: string[];
	p: string[];
}>`
	margin: ${(props) =>
		props.m &&
		props.m.map((marginSize) => `var(--${marginSize})`).join(" ")};
	padding: ${(props) =>
		props.p &&
		props.p.map((paddingSize) => `var(--${paddingSize})`).join(" ")};
	text-align: ${(props) => props.alignment !== null && props.alignment};
	font-family: "Plus Jakarta Sans";

	${(props) =>
		props.variant === "title" &&
		`
			font-size: 40px;
			font-weight: 600;
			color: var(--text);
	`}

	${(props) =>
		props.variant === "subtitle-fst" &&
		`
			line-height: 38px;
			font-size: 30px;
			font-weight: 600;
			color: var(--text);
	`}

${(props) =>
		props.variant === "subtitle-fst desktop" &&
		`
			line-height: 38px;
			font-size: 40px;
			font-weight: 600;
			color: var(--text);
	`}

	${(props) =>
		props.variant === "subtitle-snd" &&
		`
			line-height: 20px;
			font-size: 18px;
			font-weight: 600;
			color: var(--text);
	`}

${(props) =>
		props.variant === "paragraph" &&
		`
			font-size: 16px;
			font-weight: 400;
			line-height: 20px;
			opacity: 80%;
			color: var(--text);
	`}

	${(props) =>
		props.variant === "paragraph work-card" &&
		`
			font-size: 14px;
			font-weight: 400;
			line-height: 20px;
			opacity: 80%;
			color: var(--text);
	`}

${(props) =>
		props.variant === "paragraph desktop" &&
		`
			text-align: start;
			font-weight: 400;
			word-spacing: 2px;
			opacity: 80%;
			color: var(--text);

			@media (min-width: 1440px) {
				& {
					font-size: 16px;
					line-height: 28px;
				}
			}

			@media (min-width: 1800px) {
				& {
					font-size: 18px;
					line-height: 36px;
				}
			}
	`}

	${(props) =>
		props.variant === "details-fst" &&
		`
			line-height: 15px;
			font-size: 12px;
			opacity: 80%;
			color: var(--text);
			
	`}

	${(props) =>
		props.variant === "details-snd" &&
		`
			line-height: 10px;
			font-size: 10px;
			font-weight: 500;
	`}
`;
