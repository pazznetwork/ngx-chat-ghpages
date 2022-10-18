'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">@pazznetwork/ngx-chat documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-b1aa4fc5fbf7c1733f2ba83f5d717c25f613a737c65f99e0c0c91d5a0615dbebee0b167e239e4a49fae38cd1af91cfb05da5f103852b52b975ef77755eade67a"' : 'data-target="#xs-components-links-module-AppModule-b1aa4fc5fbf7c1733f2ba83f5d717c25f613a737c65f99e0c0c91d5a0615dbebee0b167e239e4a49fae38cd1af91cfb05da5f103852b52b975ef77755eade67a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-b1aa4fc5fbf7c1733f2ba83f5d717c25f613a737c65f99e0c0c91d5a0615dbebee0b167e239e4a49fae38cd1af91cfb05da5f103852b52b975ef77755eade67a"' :
                                            'id="xs-components-links-module-AppModule-b1aa4fc5fbf7c1733f2ba83f5d717c25f613a737c65f99e0c0c91d5a0615dbebee0b167e239e4a49fae38cd1af91cfb05da5f103852b52b975ef77755eade67a"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IndexComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IndexComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IqComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IqComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MucComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MucComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MultiUserChatComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MultiUserChatComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SendStanzaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SendStanzaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UiComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UiComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NgxChatModule.html" data-type="entity-link" >NgxChatModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-NgxChatModule-c5a87c96814b21a26bdb120494306d0967f041ac3a1757921636fb9a0a4ac11031c6629874d5ae9ae14fbf667b0245059d8577579f04eaaf61ac0c1dc654461f"' : 'data-target="#xs-components-links-module-NgxChatModule-c5a87c96814b21a26bdb120494306d0967f041ac3a1757921636fb9a0a4ac11031c6629874d5ae9ae14fbf667b0245059d8577579f04eaaf61ac0c1dc654461f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NgxChatModule-c5a87c96814b21a26bdb120494306d0967f041ac3a1757921636fb9a0a4ac11031c6629874d5ae9ae14fbf667b0245059d8577579f04eaaf61ac0c1dc654461f"' :
                                            'id="xs-components-links-module-NgxChatModule-c5a87c96814b21a26bdb120494306d0967f041ac3a1757921636fb9a0a4ac11031c6629874d5ae9ae14fbf667b0245059d8577579f04eaaf61ac0c1dc654461f"' }>
                                            <li class="link">
                                                <a href="components/ChatAvatarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatAvatarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatMessageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatMessageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatMessageInputComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatMessageInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatMessageLinkComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatMessageLinkComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatMessageListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatMessageListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatMessageSimpleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatMessageSimpleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatMessageTextComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatMessageTextComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatVideoWindowComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatVideoWindowComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatWindowComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatWindowComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatWindowFrameComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatWindowFrameComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatWindowListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatWindowListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FileDropComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FileDropComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RosterListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RosterListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RosterRecipientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RosterRecipientComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-NgxChatModule-c5a87c96814b21a26bdb120494306d0967f041ac3a1757921636fb9a0a4ac11031c6629874d5ae9ae14fbf667b0245059d8577579f04eaaf61ac0c1dc654461f"' : 'data-target="#xs-directives-links-module-NgxChatModule-c5a87c96814b21a26bdb120494306d0967f041ac3a1757921636fb9a0a4ac11031c6629874d5ae9ae14fbf667b0245059d8577579f04eaaf61ac0c1dc654461f"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-NgxChatModule-c5a87c96814b21a26bdb120494306d0967f041ac3a1757921636fb9a0a4ac11031c6629874d5ae9ae14fbf667b0245059d8577579f04eaaf61ac0c1dc654461f"' :
                                        'id="xs-directives-links-module-NgxChatModule-c5a87c96814b21a26bdb120494306d0967f041ac3a1757921636fb9a0a4ac11031c6629874d5ae9ae14fbf667b0245059d8577579f04eaaf61ac0c1dc654461f"' }>
                                        <li class="link">
                                            <a href="directives/IntersectionObserverDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IntersectionObserverDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/LinksDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LinksDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AbstractStanzaBuilder.html" data-type="entity-link" >AbstractStanzaBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractXmppPlugin.html" data-type="entity-link" >AbstractXmppPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link" >AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/BlockPlugin.html" data-type="entity-link" >BlockPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/BookmarkPlugin.html" data-type="entity-link" >BookmarkPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChatWindowState.html" data-type="entity-link" >ChatWindowState</a>
                            </li>
                            <li class="link">
                                <a href="classes/Contact.html" data-type="entity-link" >Contact</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityCapabilitiesPlugin.html" data-type="entity-link" >EntityCapabilitiesPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityTimePlugin.html" data-type="entity-link" >EntityTimePlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpFileUploadPlugin.html" data-type="entity-link" >HttpFileUploadPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/LastReadEntriesNodeBuilder.html" data-type="entity-link" >LastReadEntriesNodeBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageArchivePlugin.html" data-type="entity-link" >MessageArchivePlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageCarbonsPlugin.html" data-type="entity-link" >MessageCarbonsPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessagePlugin.html" data-type="entity-link" >MessagePlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageReceivedEvent.html" data-type="entity-link" >MessageReceivedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageStatePlugin.html" data-type="entity-link" >MessageStatePlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageStore.html" data-type="entity-link" >MessageStore</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageUuidPlugin.html" data-type="entity-link" >MessageUuidPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModifyAffiliationsOrRolesStanzaBuilder.html" data-type="entity-link" >ModifyAffiliationsOrRolesStanzaBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/MucSubPlugin.html" data-type="entity-link" >MucSubPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/MultiUserChatPlugin.html" data-type="entity-link" >MultiUserChatPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/PingPlugin.html" data-type="entity-link" >PingPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/PublishStanzaBuilder.html" data-type="entity-link" >PublishStanzaBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/PublishSubscribePlugin.html" data-type="entity-link" >PublishSubscribePlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/PushPlugin.html" data-type="entity-link" >PushPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryAffiliatedMemberListStanzaBuilder.html" data-type="entity-link" >QueryAffiliatedMemberListStanzaBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryOccupantListStanzaBuilder.html" data-type="entity-link" >QueryOccupantListStanzaBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryStanzaBuilder.html" data-type="entity-link" >QueryStanzaBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegistrationPlugin.html" data-type="entity-link" >RegistrationPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/RetrieveDataStanzaBuilder.html" data-type="entity-link" >RetrieveDataStanzaBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/Room.html" data-type="entity-link" >Room</a>
                            </li>
                            <li class="link">
                                <a href="classes/RosterPlugin.html" data-type="entity-link" >RosterPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/ServiceDiscoveryPlugin.html" data-type="entity-link" >ServiceDiscoveryPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/StanzaBuilder.html" data-type="entity-link" >StanzaBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/TimeoutError.html" data-type="entity-link" >TimeoutError</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnreadMessageCountPlugin.html" data-type="entity-link" >UnreadMessageCountPlugin</a>
                            </li>
                            <li class="link">
                                <a href="classes/XmppResponseError.html" data-type="entity-link" >XmppResponseError</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ChatBackgroundNotificationService.html" data-type="entity-link" >ChatBackgroundNotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatListStateService.html" data-type="entity-link" >ChatListStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatMessageListRegistryService.html" data-type="entity-link" >ChatMessageListRegistryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContactFactoryService.html" data-type="entity-link" >ContactFactoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LogService.html" data-type="entity-link" >LogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/XmppChatAdapter.html" data-type="entity-link" >XmppChatAdapter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/XmppChatConnectionService.html" data-type="entity-link" >XmppChatConnectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/XmppClientFactoryService.html" data-type="entity-link" >XmppClientFactoryService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AffiliationModification.html" data-type="entity-link" >AffiliationModification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AttachableTrack.html" data-type="entity-link" >AttachableTrack</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatAction.html" data-type="entity-link" >ChatAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatActionContext.html" data-type="entity-link" >ChatActionContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatContactClickHandler.html" data-type="entity-link" >ChatContactClickHandler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatPlugin.html" data-type="entity-link" >ChatPlugin</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatService.html" data-type="entity-link" >ChatService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatStyle.html" data-type="entity-link" >ChatStyle</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContactMetadata.html" data-type="entity-link" >ContactMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DateMessagesGroup.html" data-type="entity-link" >DateMessagesGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FieldOption.html" data-type="entity-link" >FieldOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FieldValueType.html" data-type="entity-link" >FieldValueType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileUploadHandler.html" data-type="entity-link" >FileUploadHandler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FixedFormField.html" data-type="entity-link" >FixedFormField</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Form.html" data-type="entity-link" >Form</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FormFieldBase.html" data-type="entity-link" >FormFieldBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IdentityAttrs.html" data-type="entity-link" >IdentityAttrs</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Invitation.html" data-type="entity-link" >Invitation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Invitation-1.html" data-type="entity-link" >Invitation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IqResponseStanza.html" data-type="entity-link" >IqResponseStanza</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LinkOpener.html" data-type="entity-link" >LinkOpener</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListFormField.html" data-type="entity-link" >ListFormField</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LogInRequest.html" data-type="entity-link" >LogInRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MessageWithBodyStanza.html" data-type="entity-link" >MessageWithBodyStanza</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OccupantChangeBase.html" data-type="entity-link" >OccupantChangeBase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OccupantChangeOther.html" data-type="entity-link" >OccupantChangeOther</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OccupantKickedOrBannedChange.html" data-type="entity-link" >OccupantKickedOrBannedChange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OccupantModifiedChange.html" data-type="entity-link" >OccupantModifiedChange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OccupantNickChange.html" data-type="entity-link" >OccupantNickChange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PresenceStanza.html" data-type="entity-link" >PresenceStanza</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PublishOptions.html" data-type="entity-link" >PublishOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReportUserService.html" data-type="entity-link" >ReportUserService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoleModification.html" data-type="entity-link" >RoleModification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoomConfiguration.html" data-type="entity-link" >RoomConfiguration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoomCreationOptions.html" data-type="entity-link" >RoomCreationOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoomMessage.html" data-type="entity-link" >RoomMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoomMetadata.html" data-type="entity-link" >RoomMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoomOccupant.html" data-type="entity-link" >RoomOccupant</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoomSummary.html" data-type="entity-link" >RoomSummary</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoomUser.html" data-type="entity-link" >RoomUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SavedConference.html" data-type="entity-link" >SavedConference</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SelectFileParameters.html" data-type="entity-link" >SelectFileParameters</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Service.html" data-type="entity-link" >Service</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Stanza.html" data-type="entity-link" >Stanza</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StateDate.html" data-type="entity-link" >StateDate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TimeReference.html" data-type="entity-link" >TimeReference</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Translations.html" data-type="entity-link" >Translations</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});