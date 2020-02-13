import styled from "styled-components";
import Player from "react-player";

const Container = styled.div`
  transition: opacity 1s linear;
  display: grid;
  grid-gap: 1rem;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    height: auto;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 1.3rem;
  font-style: italic;

  small {
    font-weight: normal;
    opacity: 0.7;
  }
`;

const Explanation = styled.p`
  line-height: 1.5;
  font-weight: lighter;
`;

const Copyright = styled.div`
  font-size: 0.8rem;
  line-height: 1.3;
  opacity: 0.7;
`;

function DetailView({
  loading,
  data: {
    copyright,
    explanation,
    hdurl: hdUrl,
    media_type: mediaType,
    title,
    url
  }
}) {
  return (
    <Container style={{ opacity: loading ? 0.5 : 1 }}>
      {mediaType === "image" && (
        <a href={hdUrl} target="_blank" rel="noopener nofollow">
          <img key={url} src={url} title={title} alt={explanation} />
        </a>
      )}

      {mediaType === "video" && <Player url={url} />}

      <Title>{title}</Title>

      <Explanation>{explanation}</Explanation>

      {copyright && <Copyright>Copyright {copyright}</Copyright>}
    </Container>
  );
}

export default DetailView;
