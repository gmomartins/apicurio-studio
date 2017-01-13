/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    Component, Input, ViewEncapsulation, EventEmitter, Output, ElementRef,
    ViewChildren, QueryList, AfterViewInit
} from '@angular/core';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Subscription} from "rxjs";


@Component({
    moduleId: module.id,
    selector: 'title-editor',
    templateUrl: 'title-editor.component.html',
    encapsulation: ViewEncapsulation.None
})
export class TitleEditorComponent implements AfterViewInit {

    @Input() title: string;
    @Output() onChange: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren("newvalue") input: QueryList<ElementRef>;

    private _mousein: boolean = false;
    private _hoverSub: Subscription;
    private _hoverElem: any;

    public hovering: boolean = false;
    public editing: boolean = false;
    public hoverDims: any = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    };

    ngAfterViewInit(): void {
        this.input.changes.subscribe(changes => {
            if (changes.last) {
                changes.last.nativeElement.focus();
                changes.last.nativeElement.select();
            }
        });
    }

    public onMouseIn(event: MouseEvent): void {
        if (this.editing) {
            return;
        }
        this._mousein = true;
        this._hoverElem = event.currentTarget;
        this._hoverSub = TimerObservable.create(500).subscribe(() => {
            if (this._mousein) {
                let target: any = this._hoverElem;
                let targetRect: any = target.getBoundingClientRect();
                this.hoverDims = {
                    left: targetRect.left - 5,
                    top: targetRect.top,
                    width: targetRect.right - targetRect.left + 10 + 20,
                    height: targetRect.bottom - targetRect.top + 5
                };
                this.hovering = true;
            }
        });
    }

    public onMouseOut(): void {
        if (this.editing) {
            return;
        }
        if (this._mousein && !this.hovering) {
            this.hovering = false;
        }
        if (this._hoverSub) {
            this._hoverSub.unsubscribe();
            this._hoverSub = null;
        }
        this._mousein = false;
    }

    public onOverlayOut(): void {
        if (this.hovering) {
            this.hovering = false;
            this._mousein = false;
        }
    }

    public onStartEditing(): void {
        this.hovering = false;
        this._mousein = false;
        this.editing = true;
    }

    public onEdit(newValue: string): void {
        this.onChange.emit(newValue);
        this.editing = false;
    }

    public onCancelEdit(): void {
        this.editing = false;
    }

    public onInputKeypress(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.onCancelEdit();
        }
    }

}
