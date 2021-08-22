import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  InsertHubDocumentRequest,
  InsertTagDocumentRequest,
  InsertDocumentResponse,
  UpdateHubStatsRequest,
  UpdateDocumentResponse,
} from '@cryptomath/cryptomath-api-message-types';

@Injectable()
export class SearchService {
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

  updateHubStats(
    documentId: string,
    articlesCount: number,
    tagsCount: number,
  ): Observable<UpdateDocumentResponse> {
    return this.client.send<UpdateDocumentResponse, UpdateHubStatsRequest>(
      'update-hub-stats',
      {
        documentId,
        articlesCount,
        tagsCount,
      },
    );
  }

  insertTagDocument(
    id: number,
    hubId: number,
    hubDocumentId: string,
    name: string,
    description: string,
  ): Observable<InsertDocumentResponse> {
    return this.client.send<InsertDocumentResponse, InsertTagDocumentRequest>(
      'insert-tag-document',
      {
        id,
        hubId,
        hubDocumentId,
        name,
        description,
      },
    );
  }
}
