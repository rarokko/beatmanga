import React from 'react';
import { View, Modal, Text, Button, StyleSheet, AsyncStorage } from 'react-native';


export class NewsShowcase extends React.Component {

    constructor(props) {

        super();

        this.state = { showNews: false }
        this._init(props);
    }

    async _init(props) {

        // await AsyncStorage.removeItem(`showNews@${props.version}`);

        const newsUpdate = await AsyncStorage.getItem(`showNews@${props.version}`);

        if (!newsUpdate) {
            this.setState({ showNews: true });
        };
    }

    render() {

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.showNews}
                onRequestClose={() => {}}>

                <View style={styles.viewWrapper}>
                    <View>
                        <Text style={[styles.mainTitle, { color: "#ffffff" }]}>NEW
                        <Text style={[styles.mainTitle, { color: "#2f7cb3" }]}> UPDATE</Text>
                        </Text>
                    </View>
                    <Text style={styles.updateTitle}>{this.props.updateTitle}</Text>
                    <Text style={styles.fixedDescription}>Thanks for believing in us. Here is the newest Beatmanga features:</Text>

                    {this.props.changeList.map((changeDescription) => {
                        return <Text key={changeDescription} style={styles.changeList}>
                            <Text style={{ fontSize: 18 }}>{changeDescription.substring(0, 1)}</Text>
                            {changeDescription.substring(1, changeDescription.length)}
                        </Text>
                    })}

                    <View style={styles.buttonView}>
                        <Button
                            onPress={() => { this._markAsRead(this.props.version) }}
                            title="I got it!"
                            color="#2f7cb3"
                            accessibilityLabel="Done"
                        />
                    </View>
                </View>
            </Modal>
        )
    }

    async _markAsRead(version) {
        await AsyncStorage.setItem(`showNews@${version}`, "true");
        this.setState({ showNews: false });
    };
}

const styles = StyleSheet.create({
    viewWrapper: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 15
    },
    mainTitle: {
        fontSize: 40,
        fontWeight: "bold"
    },
    updateTitle: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 50
    },
    fixedDescription: {
        color: "#ffffff",
        textAlign: "center",
        marginTop: 15,
        marginBottom: 15
    },
    changeList: {
        color: "#ffffff",
        textAlign: "center",
        marginBottom: 15
    },
    buttonView: {
        marginTop: 40
    }
});