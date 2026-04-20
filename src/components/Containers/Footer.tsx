import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
import { mq } from "../../config/breakpoints";

//* Components
import Container from "./Container";
import Text from "../Text";
import ThemeSwitcher from "../ThemeSwitcher";
import LanguageSwitcher from "../LanguageSwitcher";

const StyledFooter = styled.footer`
	position: relative;
	width: calc(100% - 24px);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: var(--24);
	padding: var(--36) var(--20);
	text-align: center;

	${mq.up('desktop-sm')} {
		width: 90%;
		text-align: initial;
	}

	& a {
		color: var(--text);
	}
`;

const SwitchersContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const CURRENT_YEAR = new Date().getFullYear();

function Footer({ ref, ...props }: React.ComponentPropsWithRef<'footer'>) {
	const { t } = useTranslation('common');

	return (
		<StyledFooter ref={ref} {...props}>
			<Container
				w={"80%"}
				justify={"center"}
				align={"center"}
			>
				<Text
					variant={"label"}
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
				>
					{t('copyright', { year: CURRENT_YEAR })}
				</Text>
			</Container>
		</StyledFooter>
	);
}

export default Footer;
