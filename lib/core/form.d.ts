import { Element } from 'ltx';
import { JID } from '@xmpp/jid';
export declare const FORM_NS = "jabber:x:data";
export declare type FormType = 'form' | 'submit' | 'cancel' | 'result';
export interface Form {
    type: FormType;
    title?: string;
    instructions: string[];
    fields: FormField[];
}
export declare type FieldType = 'fixed' | 'boolean' | 'hidden' | 'jid-single' | 'jid-multi' | 'list-single' | 'list-multi' | 'text-single' | 'text-private' | 'text-multi';
export interface FieldValueType {
    fixed: string;
    boolean: boolean;
    hidden: string;
    'jid-single': JID;
    'jid-multi': JID[];
    'list-single': string;
    'list-multi': string[];
    'text-single': string;
    'text-private': string;
    'text-multi': string[];
}
export declare type FormField = FixedFormField | BooleanFormField | TextualFormField | JidSingleFormField | JidMultiFormField | ListSingleFormField | ListMultiFormField | TextMultiFormField;
export interface FixedFormField {
    type: 'fixed';
    variable?: string;
    value: string;
}
interface FormFieldBase<TFieldType extends FieldType> {
    type: TFieldType;
    variable: string;
    label?: string;
    required?: boolean;
    description?: string;
    value?: FieldValueType[TFieldType];
}
export declare type BooleanFormField = FormFieldBase<'boolean'>;
export declare type TextualFormField = FormFieldBase<'hidden' | 'text-single' | 'text-private'>;
export declare type JidSingleFormField = FormFieldBase<'jid-single'>;
export declare type JidMultiFormField = FormFieldBase<'jid-multi'>;
export declare type TextMultiFormField = FormFieldBase<'text-multi'>;
interface ListFormField<TFieldType extends 'list-single' | 'list-multi'> extends FormFieldBase<TFieldType> {
    options?: FieldOption[];
}
export declare type ListSingleFormField = ListFormField<'list-single'>;
export declare type ListMultiFormField = ListFormField<'list-multi'>;
export interface FieldOption {
    label?: string;
    value: string;
}
export declare function parseForm(formEl: Element): Form;
export declare function getField(form: Form, variable: string): FormField | undefined;
export declare function setFieldValue<TFieldType extends FieldType, TValue extends FieldValueType[TFieldType]>(form: Form, type: TFieldType, variable: string, value: TValue, createField?: boolean): void;
export declare function serializeToSubmitForm(form: Form): Element;
export {};
