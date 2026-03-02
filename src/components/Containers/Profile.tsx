import styled from "styled-components";
import { useTranslation } from "react-i18next";

//?  Hooks
import { useTheme } from "../../hooks/useTheme";

//* Components
import Container from "./Container";
import AsciiProfile from "../AsciiProfile";
import SocialButton from "../SocialButton";
import Text from "../Text";

//* Assets
import profilePicture from "../../assets/images/profile.jpg";
import profilePictureLight from "../../assets/images/profile-light.jpg";

//* Icon registry
import { iconRegistry } from "../Icon";

//* Styles
import { glassBorder, noisePatternBackground } from "../../styles/mixins";

const StyledProfile = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: var(--48);
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: var(--20);
  gap: var(--36);
  order: -1;
  ${glassBorder(true)}
  ${noisePatternBackground}

  @media (min-width: 1280px) {
    grid-area: profile;
    order: unset;
    justify-content: center;
    margin: var(--36) 0;
    min-height: 450px;
  }

  @media (min-width: 1440px) {
    min-height: 490px;
  }

  @media (min-width: 1801px) {
    min-height: 530px;
  }
`;

export default function Profile() {
  const { t } = useTranslation("home");
  const { isDarkMode } = useTheme();

  return (
    <StyledProfile>
      <AsciiProfile src={isDarkMode ? profilePicture : profilePictureLight} />
      <Container
        w={"100%"}
        h={"auto"}
        direction={"column"}
        justify={"space-between"}
        align={"center"}
        gap={"24px"}
      >
        <Text as="h2" variant={"subtitle-sm"}>
          {t("profile.findMeAt")}
        </Text>
        <Container justify={"center"} align={"center"} gap={"8px"}>
          <SocialButton
            url={"https://www.x.com/fachebits"}
            Icon={iconRegistry.twitter}
            alt="Twitter"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={"https://www.threads.net/@fache.bits"}
            Icon={iconRegistry.threads}
            alt="Threads"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={"https://www.instagram.com/fache.bits/"}
            Icon={iconRegistry.instagram}
            alt="Instagram"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={"https://www.linkedin.com/in/tobiasfacello/"}
            Icon={iconRegistry.linkedin}
            alt="LinkedIn"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={"https://www.github.com/tobiasfacello"}
            Icon={iconRegistry.github}
            alt="GitHub"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={"https://contra.com/tobiasfacello"}
            Icon={iconRegistry.contra}
            alt="Contra"
            tooltipPosition="bottom"
          />
        </Container>
      </Container>
    </StyledProfile>
  );
}
