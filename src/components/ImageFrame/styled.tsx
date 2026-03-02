import styled from "styled-components";
import { spacingArray } from "../../styles/mixins";
import { mq } from "../../config/breakpoints";

export const StyledImageFrame = styled.div<{
	$m?: string[];
	$p?: string[];
}>`
	margin: ${(props) => spacingArray(props.$m)};
	padding: ${(props) => spacingArray(props.$p)};

	${mq.up(360)} {
		& {
			width: 175px;
			height: 175px;
			border-width: 1.5px;
			border-radius: 100px;
		}

		${mq.up('desktop-sm')} {
			& {
				width: 275px;
				height: 275px;
				border-width: 3px;
				border-radius: var(--radius-circle);
			}
		}

		${mq.up('desktop-lg')} {
			& {
				width: 345px;
				height: 345px;
				border-width: 3px;
				border-radius: var(--radius-circle);
			}
		}
	}

	& > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		border-radius: var(--radius-circle);
	}
`;
