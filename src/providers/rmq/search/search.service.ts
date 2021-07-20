import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  InsertHubDocumentRequest,
  InsertDocumentResponse,
} from 'cryptomath-api-message-types';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(@Inject('SEARCH_SERVICE') private client: ClientProxy) {}

  insertHubDocument(
    id: number,
    name: string,
    description: string,
  ): Observable<InsertDocumentResponse> {
    return this.client.send<InsertDocumentResponse, InsertHubDocumentRequest>(
      'insert-hub-document',
      {
        id,
        name,
        description,
      },
    );
  }
}
