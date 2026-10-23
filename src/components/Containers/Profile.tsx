import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { mq } from "../../config/breakpoints";

//?  Hooks
import { useTheme } from "../../hooks/useTheme";

//* Components
import Container from "./Container";
import SocialButton from "../SocialButton";
import Text from "../Text";

//* Assets
import profilePicture from "../../assets/images/profile.webp";
import profilePictureSmall from "../../assets/images/profile-360.webp";
import profilePictureLight from "../../assets/images/profile-light.webp";

//? Config
import { PROFILE_IMAGE_SIZES } from "../../config/profileImage";

// The dark photo is the page's LCP element; phones (175px slot) get the 360px
// variant. The light one is a tiny illustration Vite inlines, so it has no srcset.
const PROFILE_SRCSET = `${profilePictureSmall} 360w, ${profilePicture} 600w`;

//* Icon registry
import { iconRegistry } from "../Icon";

//* Styles
import { sectionBase } from "../../styles/mixins";

//? Data
import { TWITTER_URL, THREADS_URL, INSTAGRAM_URL, LINKEDIN_URL, GITHUB_URL, CONTRA_URL } from "../../data/socialFeed";

const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  width: 175px;
  height: 175px;

  ${mq.up('desktop-sm')} {
    width: 275px;
    height: 275px;
  }

  ${mq.up('desktop-lg')} {
    width: 345px;
    height: 345px;
  }
`;

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
      <ProfileImage
        src={isDarkMode ? profilePicture : profilePictureLight}
        srcSet={isDarkMode ? PROFILE_SRCSET : undefined}
        sizes={isDarkMode ? PROFILE_IMAGE_SIZES : undefined}
        alt="Profile photo of Tobias Facello"
        width={345}
        height={345}
        decoding="async"
        fetchPriority="high"
      />
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
        <nav aria-label="Social links">
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
        </nav>
      </Container>
    </StyledProfile>
  );
}
