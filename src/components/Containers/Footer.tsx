import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
import { mq } from "../../config/breakpoints";

//* Components
import Container from "./Container";
import Text from "../Text";
import ThemeSwitcher from "../ThemeSwitcher";
import LanguageSwitcher from "../LanguageSwitcher";

//* Styles
import { glassBorder } from "../../styles/mixins";

const StyledFooter = styled.footer`
	width: calc(100% - 24px);
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: var(--24);
	padding: var(--36) var(--20);
	text-align: center;
	overflow: hidden;
	${glassBorder(true)}

	${mq.up('desktop-sm')} {
		width: 90%;
		text-align: initial;
	}

	& a {
		color: var(--text);
	}

	&::before {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 357px;
		background-image: url('/vectors/header-vector.svg');
		background-position: top center;
		background-size: 100% auto;
		background-repeat: no-repeat;
		transform: scaleY(-1);
		pointer-events: none;
		z-index: 0;

		${mq.up('desktop-sm')} {
			background-image: url('/vectors/header-vector-desktop.svg');
		}
	}

	@media (prefers-color-scheme: light) {
		&::before {
			background-image: url('/vectors/header-vector-light.svg');

			${mq.up('desktop-sm')} {
				background-image: url('/vectors/header-vector-desktop-light.svg');
			}
		}
	}

	:root[data-theme="light"] &::before {
		background-image: url('/vectors/header-vector-light.svg');

		${mq.up('desktop-sm')} {
			background-image: url('/vectors/header-vector-desktop-light.svg');
		}
	}

	:root[data-theme="dark"] &::before {
		background-image: url('/vectors/header-vector.svg');

		${mq.up('desktop-sm')} {
			background-image: url('/vectors/header-vector-desktop.svg');
		}
	}
`;

const SwitchersContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const CURRENT_YEAR = new Date().getFullYear();

function Footer() {
	const { t } = useTranslation('common');

	return (
		<StyledFooter>
			<Container
				w={"80%"}
				justify={"center"}
				align={"center"}
			>
				<Text
					variant={"label"}
					m={["0", "0", "0", "0"]}
				>
					<Trans
						i18nKey="footerCta"
						ns="common"
						components={{
							cta: <a href="https://cal.com/tobiasfacello"><u /></a>,
						}}
					/>
				</Text>
			</Container>
			<Container
				justify={"center"}
				align={"center"}
			>
				<SwitchersContainer>
					<ThemeSwitcher />
					<LanguageSwitcher />
				</SwitchersContainer>
			</Container>
			<Container
				direction={"column"}
				justify={"center"}
				align={"center"}
			>
				<Text
					variant={"label"}
					m={["0", "0", "0", "0"]}
				>
					{t('copyright', { year: CURRENT_YEAR })}
				</Text>
			</Container>
		</StyledFooter>
	);
}

export default Footer;
