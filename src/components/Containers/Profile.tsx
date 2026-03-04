import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { mq } from "../../config/breakpoints";

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
import { sectionBase } from "../../styles/mixins";

//? Data
import { TWITTER_URL, THREADS_URL, INSTAGRAM_URL, LINKEDIN_URL, GITHUB_URL, CONTRA_URL } from "../../data/socialFeed";

const StyledProfile = styled.div`
  ${sectionBase('profile')}
  justify-content: space-between;
  margin-top: var(--48);
  padding: var(--20);
  gap: var(--36);
  order: -1;

  ${mq.up('desktop-sm')} {
    order: unset;
    justify-content: center;
    margin: var(--36) 0;
    min-height: 450px;
  }

  ${mq.up('desktop-lg')} {
    min-height: 490px;
  }

  ${mq.up('desktop-xl')} {
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
            url={TWITTER_URL}
            Icon={iconRegistry.twitter}
            alt="Twitter"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={THREADS_URL}
            Icon={iconRegistry.threads}
            alt="Threads"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={INSTAGRAM_URL}
            Icon={iconRegistry.instagram}
            alt="Instagram"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={LINKEDIN_URL}
            Icon={iconRegistry.linkedin}
            alt="LinkedIn"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={GITHUB_URL}
            Icon={iconRegistry.github}
            alt="GitHub"
            tooltipPosition="bottom"
          />
          <SocialButton
            url={CONTRA_URL}
            Icon={iconRegistry.contra}
            alt="Contra"
            tooltipPosition="bottom"
          />
        </Container>
      </Container>
    </StyledProfile>
  );
}
