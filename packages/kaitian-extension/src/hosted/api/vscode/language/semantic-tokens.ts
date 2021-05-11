import * as vscode from 'vscode';
import { asPromise, CancellationToken, IRange } from '@ali/ide-core-common';

import { ExtensionDocumentDataManager } from '../../../../common/vscode';
import { SemanticTokensEdits, Uri } from '../../../../common/vscode/ext-types';
import * as TypeConverts from '../../../../common/vscode/converter';
import { encodeSemanticTokensDto } from '../../../../common/vscode/semantic-tokens';

class SemanticTokensPreviousResult {
  constructor(
    public readonly resultId: string | undefined,
    public readonly tokens?: Uint32Array,
  ) { }
}

export class DocumentSemanticTokensAdapter {

  private readonly _previousResults: Map<number, SemanticTokensPreviousResult>;
  private _nextResultId = 1;

  constructor(
    private readonly _documents: ExtensionDocumentDataManager,
    private readonly _provider: vscode.DocumentSemanticTokensProvider,
  ) {
    this._previousResults = new Map<number, SemanticTokensPreviousResult>();
  }

  async provideDocumentSemanticTokens(resource: Uri, previousResultId: number, token: CancellationToken): Promise<Uint8Array | null> {
    const doc = this._documents.getDocument(resource);
    const previousResult = (previousResultId !== 0 ? this._previousResults.get(previousResultId) : null);
    const value = await asPromise(() => {
      if (previousResult && typeof previousResult.resultId === 'string' && typeof this._provider.provideDocumentSemanticTokensEdits === 'function') {
        return this._provider.provideDocumentSemanticTokensEdits((doc!), previousResult.resultId, token);
      }
      return this._provider.provideDocumentSemanticTokens((doc!), token);
    });
    if (previousResult) {
      this._previousResults.delete(previousResultId);
    }
    if (!value) {
      return null;
    }
    return this._send(DocumentSemanticTokensAdapter._convertToEdits(previousResult, value), value);
  }

  async releaseDocumentSemanticColoring(semanticColoringResultId: number): Promise<void> {
    this._previousResults.delete(semanticColoringResultId);
  }

  private static _isSemanticTokens(v: vscode.SemanticTokens | vscode.SemanticTokensEdits): v is vscode.SemanticTokens {
    return v && !!((v as vscode.SemanticTokens).data);
  }

  private static _isSemanticTokensEdits(v: vscode.SemanticTokens | vscode.SemanticTokensEdits): v is vscode.SemanticTokensEdits {
    return v && Array.isArray((v as vscode.SemanticTokensEdits).edits);
  }

  private static _convertToEdits(previousResult: SemanticTokensPreviousResult | null | undefined, newResult: vscode.SemanticTokens | vscode.SemanticTokensEdits): vscode.SemanticTokens | vscode.SemanticTokensEdits {
    if (!DocumentSemanticTokensAdapter._isSemanticTokens(newResult)) {
      return newResult;
    }
    if (!previousResult || !previousResult.tokens) {
      return newResult;
    }
    const oldData = previousResult.tokens;
    const oldLength = oldData.length;
    const newData = newResult.data;
    const newLength = newData.length;

    let commonPrefixLength = 0;
    const maxCommonPrefixLength = Math.min(oldLength, newLength);
    while (commonPrefixLength < maxCommonPrefixLength && oldData[commonPrefixLength] === newData[commonPrefixLength]) {
      commonPrefixLength++;
    }

    if (commonPrefixLength === oldLength && commonPrefixLength === newLength) {
      // complete overlap!
      return new SemanticTokensEdits([], newResult.resultId);
    }

    let commonSuffixLength = 0;
    const maxCommonSuffixLength = maxCommonPrefixLength - commonPrefixLength;
    while (commonSuffixLength < maxCommonSuffixLength && oldData[oldLength - commonSuffixLength - 1] === newData[newLength - commonSuffixLength - 1]) {
      commonSuffixLength++;
    }

    return new SemanticTokensEdits([{
      start: commonPrefixLength,
      deleteCount: (oldLength - commonPrefixLength - commonSuffixLength),
      data: newData.subarray(commonPrefixLength, newLength - commonSuffixLength),
    }], newResult.resultId);
  }

  private _send(value: vscode.SemanticTokens | vscode.SemanticTokensEdits, original: vscode.SemanticTokens | vscode.SemanticTokensEdits): Uint8Array | null {
    if (DocumentSemanticTokensAdapter._isSemanticTokens(value)) {
      const myId = this._nextResultId++;
      this._previousResults.set(myId, new SemanticTokensPreviousResult(value.resultId, value.data));
      const result = encodeSemanticTokensDto({
        id: myId,
        type: 'full',
        data: value.data,
      });
      return result;
    }

    if (DocumentSemanticTokensAdapter._isSemanticTokensEdits(value)) {
      const myId = this._nextResultId++;
      if (DocumentSemanticTokensAdapter._isSemanticTokens(original)) {
        // store the original
        this._previousResults.set(myId, new SemanticTokensPreviousResult(original.resultId, original.data));
      } else {
        this._previousResults.set(myId, new SemanticTokensPreviousResult(value.resultId));
      }

      const result = encodeSemanticTokensDto({
        id: myId,
        type: 'delta',
        deltas: (value.edits || []).map((edit) => ({ start: edit.start, deleteCount: edit.deleteCount, data: edit.data })),
      });
      return result;
    }

    return null;
  }
}

export class DocumentRangeSemanticTokensAdapter {

  constructor(
    private readonly _documents: ExtensionDocumentDataManager,
    private readonly _provider: vscode.DocumentRangeSemanticTokensProvider,
  ) {
  }

  provideDocumentRangeSemanticTokens(resource: Uri, range: IRange, token: CancellationToken): Promise<Uint8Array | null> {
    const doc = this._documents.getDocument(resource);
    return asPromise(() => this._provider.provideDocumentRangeSemanticTokens(doc!, TypeConverts.Range.to(range)!, token)).then((value) => {
      if (!value) {
        return null;
      }
      return this._send(value);
    });
  }

  private _send(value: vscode.SemanticTokens): Uint8Array | null {
    return encodeSemanticTokensDto({
      id: 0,
      type: 'full',
      data: value.data,
    });
  }
}