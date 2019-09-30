import * as React from "react";
import { Theme, createStyles, WithStyles, Button, withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { ApplicationState } from "../../../../stores/index";
import { selectShapePicker, ShapePicker } from "../../../../redux/actions/GoogleMapsActions";
import { createPortal } from "react-dom";
import ShapeCirclePlus from "mdi-material-ui/ShapeCirclePlus";
import ShapePolygonPlus from "mdi-material-ui/ShapePolygonPlus";

const styles = (theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: "#fff",
            border: "2px solid #fff",
            borderRadius: "3px",
            boxShadow: "0 2px 6px rgba(0,0,0,.3)",
            cursor: "pointer",
            marginBottom: "22px",
            marginTop: "10px",
            textAlign: "center",
        },
        font: {
            fontFamily: "'Lato', sans-serif",
        },
    });

const mapStateToProps = (state: ApplicationState) => {
    return { selectedShape: state.googleMaps.selectedShapePicker, enabled: !state.geoFenceDrawer.isOpen };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        selectShapePicker: (shape: ShapePicker) => {
            const selectShapePickerAction = selectShapePicker(shape);
            dispatch(selectShapePickerAction);
        },
    };
};

interface GoogleMapsShapePickerProps extends WithStyles<typeof styles> {
    selectShapePicker: (shape: ShapePicker) => void;
    map: google.maps.Map;
    selectedShape: ShapePicker;
    enabled: boolean;
}

class GoogleMapsShapePicker extends React.Component<GoogleMapsShapePickerProps> {
    constructor(props: GoogleMapsShapePickerProps) {
        super(props);
        this.googleMapsShapePickerContainer = document.createElement("div");
        this.props.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.googleMapsShapePickerContainer);
    }

    googleMapsShapePickerContainer: HTMLDivElement = undefined;

    handleCirclularClick = () => {
        if (this.props.selectedShape != ShapePicker.Circle) {
            this.props.selectShapePicker(ShapePicker.Circle);
        }
    };

    handlePolygonClick = () => {
        if (this.props.selectedShape != ShapePicker.Polygon) {
            this.props.selectShapePicker(ShapePicker.Polygon);
        }
    };

    render() {
        const { classes, selectedShape } = this.props;
        return createPortal(
            <div className={classes.root}>
                <Button
                    className={classes.font}
                    disabled={!this.props.enabled}
                    variant={selectedShape === ShapePicker.Circle ? "contained" : "text"}
                    color="primary"
                    onClick={this.handleCirclularClick}
                >
                    <ShapeCirclePlus />
                    Circle
                </Button>
                <Button
                    className={classes.font}
                    disabled={!this.props.enabled}
                    variant={selectedShape === ShapePicker.Polygon ? "contained" : "text"}
                    color="primary"
                    onClick={this.handlePolygonClick}
                >
                    <ShapePolygonPlus />
                    Polygon
                </Button>
            </div>,
            this.googleMapsShapePickerContainer
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(GoogleMapsShapePicker));
