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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation} from "@angular/core";
import {Oas20SchemaDefinition, Oas30SchemaDefinition} from "oai-ts-core";
import {AbstractBaseComponent} from "../common/base-component";
import {DocumentService} from "../../_services/document.service";


@Component({
    moduleId: module.id,
    selector: "[definition-item]",
    templateUrl: "definition-item.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefinitionItemComponent extends AbstractBaseComponent {

    @Input() schema: Oas20SchemaDefinition | Oas30SchemaDefinition;

    constructor(private changeDetectorRef: ChangeDetectorRef, private documentService: DocumentService) {
        super(changeDetectorRef, documentService);
    }

    /**
     * Returns the name of the definition.
     */
    public definitionName(): string {
        return this.schema.ownerDocument().is2xDocument() ?
            (this.schema as Oas20SchemaDefinition).definitionName() :
            (this.schema as Oas30SchemaDefinition).name();
    }

}
