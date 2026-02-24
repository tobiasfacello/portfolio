import styled from "styled-components";
import { useTranslation } from "react-i18next";

//* Components
import Container from "./Container";
import AsciiProfile from "../AsciiProfile";
import SocialButton from "../SocialButton";
import Text from "../Text";

//* Assets
import profilePicture from "../../assets/images/profile.jpg";
import TwitterIcon from "../../assets/icons/Twitter.svg?react";
import ThreadsIcon from "../../assets/icons/Threads.svg?react";
import InstagramIcon from "../../assets/icons/Instagram.svg?react";
import LinkedinIcon from "../../assets/icons/Linkedin.svg?react";
import GithubIcon from "../../assets/icons/Github.svg?react";
import ContraIcon from "../../assets/icons/Contra.svg?react";

//* Styles
import { glassBorder } from "../../styles/mixins";

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

  return (
    <StyledProfile>
      <AsciiProfile src={profilePicture} />
      <Container
        w={"100%"}
        h={"auto"}
        direction={"column"}
        justify={"space-between"}
        align={"center"}
        gap={"24px"}
      >
        <Text as="h2" variant={"subtitle-snd"}>
          {t("profile.findMeAt")}
        </Text>
        <Container justify={"center"} align={"center"} gap={"8px"}>
          <SocialButton
            url={"https://www.x.com/fachebits"}
            Icon={TwitterIcon}
            alt="Twitter"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={"https://www.threads.net/@fache.bits"}
            Icon={ThreadsIcon}
            alt="Threads"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={"https://www.instagram.com/fache.bits/"}
            Icon={InstagramIcon}
            alt="Instagram"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={"https://www.linkedin.com/in/tobiasfacello/"}
            Icon={LinkedinIcon}
            alt="LinkedIn"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={"https://www.github.com/tobiasfacello"}
            Icon={GithubIcon}
            alt="GitHub"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={"https://contra.com/tobiasfacello"}
            Icon={ContraIcon}
            alt="Contra"
            tooltipPosition="bottom"
          />
        </Container>
      </Container>
    </StyledProfile>
  );
}
