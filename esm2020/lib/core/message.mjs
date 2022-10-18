export var MessageState;
(function (MessageState) {
    /**
     * Not yet sent
     */
    MessageState["SENDING"] = "sending";
    /**
     * Sent, but neither received nor seen by the recipient
     */
    MessageState["SENT"] = "sent";
    /**
     * The recipient client has received the message but the recipient has not seen it yet
     */
    MessageState["RECIPIENT_RECEIVED"] = "recipientReceived";
    /**
     * The message has been seen by the recipient
     */
    MessageState["RECIPIENT_SEEN"] = "recipientSeen";
})(MessageState || (MessageState = {}));
export var Direction;
(function (Direction) {
    Direction["in"] = "in";
    Direction["out"] = "out";
})(Direction || (Direction = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29yZS9tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBTixJQUFZLFlBaUJYO0FBakJELFdBQVksWUFBWTtJQUNwQjs7T0FFRztJQUNILG1DQUFtQixDQUFBO0lBQ25COztPQUVHO0lBQ0gsNkJBQWEsQ0FBQTtJQUNiOztPQUVHO0lBQ0gsd0RBQXdDLENBQUE7SUFDeEM7O09BRUc7SUFDSCxnREFBZ0MsQ0FBQTtBQUNwQyxDQUFDLEVBakJXLFlBQVksS0FBWixZQUFZLFFBaUJ2QjtBQWVELE1BQU0sQ0FBTixJQUFZLFNBR1g7QUFIRCxXQUFZLFNBQVM7SUFDakIsc0JBQVMsQ0FBQTtJQUNULHdCQUFXLENBQUE7QUFDZixDQUFDLEVBSFcsU0FBUyxLQUFULFNBQVMsUUFHcEIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZW51bSBNZXNzYWdlU3RhdGUge1xuICAgIC8qKlxuICAgICAqIE5vdCB5ZXQgc2VudFxuICAgICAqL1xuICAgIFNFTkRJTkcgPSAnc2VuZGluZycsXG4gICAgLyoqXG4gICAgICogU2VudCwgYnV0IG5laXRoZXIgcmVjZWl2ZWQgbm9yIHNlZW4gYnkgdGhlIHJlY2lwaWVudFxuICAgICAqL1xuICAgIFNFTlQgPSAnc2VudCcsXG4gICAgLyoqXG4gICAgICogVGhlIHJlY2lwaWVudCBjbGllbnQgaGFzIHJlY2VpdmVkIHRoZSBtZXNzYWdlIGJ1dCB0aGUgcmVjaXBpZW50IGhhcyBub3Qgc2VlbiBpdCB5ZXRcbiAgICAgKi9cbiAgICBSRUNJUElFTlRfUkVDRUlWRUQgPSAncmVjaXBpZW50UmVjZWl2ZWQnLFxuICAgIC8qKlxuICAgICAqIFRoZSBtZXNzYWdlIGhhcyBiZWVuIHNlZW4gYnkgdGhlIHJlY2lwaWVudFxuICAgICAqL1xuICAgIFJFQ0lQSUVOVF9TRUVOID0gJ3JlY2lwaWVudFNlZW4nLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2Uge1xuICAgIGRpcmVjdGlvbjogRGlyZWN0aW9uO1xuICAgIGJvZHk6IHN0cmluZztcbiAgICBkYXRldGltZTogRGF0ZTtcbiAgICBpZD86IHN0cmluZztcbiAgICBkZWxheWVkOiBib29sZWFuO1xuICAgIGZyb21BcmNoaXZlOiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIGlmIG5vIGV4cGxpY2l0IHN0YXRlIGlzIHNldCBmb3IgdGhlIG1lc3NhZ2UsIHVzZSBpbXBsaWNpdCBjb250YWN0IG1lc3NhZ2Ugc3RhdGVzIGluc3RlYWQuXG4gICAgICovXG4gICAgc3RhdGU/OiBNZXNzYWdlU3RhdGU7XG59XG5cbmV4cG9ydCBlbnVtIERpcmVjdGlvbiB7XG4gICAgaW4gPSAnaW4nLFxuICAgIG91dCA9ICdvdXQnLFxufVxuIl19