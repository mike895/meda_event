import { Button, message, Modal, Rate } from "antd";
import React, { useState } from "react";

function ImageCard( {schedule}: any) {
  const [visible, setVisible] = useState(false);
  
  return (
    <>
      <Modal
        title="Event Trailer"
        centered
        visible={visible}
        width={1280}
        destroyOnClose
        footer={[]}
        bodyStyle={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
        onCancel={() => setVisible(false)}
      >
        <iframe
          width="1080"
          height="520"
          src={schedule?.event?.trailerLink}
          //   title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Modal>

      <div
        style={{
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          width: "200px",
            height: "340px",
          margin: "10px 10px",
        }}
      >
        <div
          //   className={styles["image-section"]}
          style={{
            width: 200,
            height: 280,
            borderRadius: 5,
            backgroundImage: `url(${schedule?.event?.posterImg})`,
            backgroundSize: "cover",
            boxShadow:
              "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
            overflow: "clip",
            marginBottom:"15px"
          }}
        ></div>
        <Button
          block
          size="large"
          style={{
            borderRadius: 10,
            backgroundColor: "transparent",
            fontWeight: "500",
            borderWidth: 1,
            borderColor: "#F56A05",
            color: "#F56A05",
          }}
          onClick={() => {
            if (schedule.event.trailerLink == null)
              return message.info(
                "A trailer is not available right now for this movie"
              );
            setVisible(true);
          }}
        >
          Watch trailer
        </Button>
      </div>
    </>
  );
}

export default ImageCard;
