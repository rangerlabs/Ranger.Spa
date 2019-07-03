import * as React from "react";
import { useTransition, animated, config } from "react-spring";
import { Theme, WithStyles, withStyles, createStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
const Image0 = require("../../../../assets/background_slider_01.jpg");
const Image1 = require("../../../../assets/background_slider_02.jpg");
const Image2 = require("../../../../assets/background_slider_03.jpg");
const Image3 = require("../../../../assets/background_slider_04.jpg");

const styles = (theme: Theme) =>
    createStyles({
        image: {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "opacity",
        },
    });

interface ImageCarouselProps extends WithStyles<typeof styles> {}

const slides = [{ id: 0, img: Image0 }, { id: 1, img: Image1 }, { id: 2, img: Image2 }, { id: 3, img: Image3 }];
// const slides = [{ id: 0, img: undefined as any }];
function ImageCarousel(imageProps: ImageCarouselProps): any {
    const { classes } = imageProps;
    const [index, set] = useState(0);
    const transitions = useTransition(slides[index], item => item.id, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: config.molasses,
    });
    useEffect(() => {
        let timer = setTimeout(() => set(state => (state + 1) % 4), 5000);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    return transitions.map(({ item, props, key }) => (
        <animated.div key={key} className={classes.image} style={{ ...props, backgroundImage: `url(${item.img})` }} />
    ));
}

export default withStyles(styles)(ImageCarousel);
