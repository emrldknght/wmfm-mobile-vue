// need this to type ref component child methods
export default interface IListWrapper {
    getDim(): DOMRect;
    scrollTo(pos: number): void;
    scrollToBottom(): void;
}
