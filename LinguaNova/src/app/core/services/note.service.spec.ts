import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { NoteService } from './note.service';

describe('NoteService', () => {
  let service: NoteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(NoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('doit recuperer toutes les notes d un utilisateur', () => {
    service.getAll(5).subscribe();

    const req = httpMock.expectOne((request) =>
      request.url === '/notes' && request.params.get('userId') === '5'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('doit recuperer les notes par cahier', () => {
    service.getByCahier(5, 2).subscribe();

    const req = httpMock.expectOne((request) =>
      request.url === '/notes' && request.params.get('userId') === '5' && request.params.get('cahierId') === '2'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('list doit appeler getByCahier si cahierId est fourni', () => {
    const getByCahierSpy = vi.spyOn(service, 'getByCahier');

    service.list(8, 12).subscribe();

    expect(getByCahierSpy).toHaveBeenCalledWith(8, 12);
    const req = httpMock.expectOne((request) =>
      request.url === '/notes' && request.params.get('userId') === '8' && request.params.get('cahierId') === '12'
    );
    req.flush([]);
  });

  it('list doit appeler getAll si cahierId est absent', () => {
    const getAllSpy = vi.spyOn(service, 'getAll');

    service.list(9).subscribe();

    expect(getAllSpy).toHaveBeenCalledWith(9);
    const req = httpMock.expectOne((request) =>
      request.url === '/notes' && request.params.get('userId') === '9' && request.params.has('cahierId') === false
    );
    req.flush([]);
  });

  it('doit recuperer une note par id', () => {
    service.getById(3).subscribe();

    const req = httpMock.expectOne('/notes/3');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 3 });
  });

  it('doit creer une note', () => {
    const payload = { title: 'Chapitre 1' } as any;

    service.create(payload).subscribe((item) => {
      expect(item).toEqual({ id: 55, title: 'Chapitre 1' } as any);
    });

    const req = httpMock.expectOne('/notes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 55, title: 'Chapitre 1' });
  });

  it('doit mettre a jour une note', () => {
    const payload = { content: 'Contenu mis a jour' } as any;

    service.update(55, payload).subscribe((item) => {
      expect(item).toEqual({ id: 55, content: 'Contenu mis a jour' } as any);
    });

    const req = httpMock.expectOne('/notes/55');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 55, content: 'Contenu mis a jour' });
  });

  it('doit supprimer une note', () => {
    service.delete(55).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('/notes/55');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('doit uploader une piece jointe', () => {
    const file = new File(['abc'], 'test.txt', { type: 'text/plain' });

    service.uploadAttachment(10, file, 7).subscribe((res: any) => {
      expect(res.id).toBe(999);
      expect(res.fileName).toBe('test.txt');
    });

    const req = httpMock.expectOne('/notes/10/attachments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    const body = req.request.body as FormData;
    expect(body.get('uploadedBy')).toBe('7');
    req.flush({ id: 999, fileName: 'test.txt' });
  });

  it('doit supprimer une piece jointe', () => {
    service.deleteAttachment(999).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('/notes/attachments/999');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('doit telecharger une piece jointe en blob', () => {
    service.downloadAttachment(999).subscribe((blob) => {
      expect(blob instanceof Blob).toBe(true);
      expect(blob.size).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne('/notes/attachments/999/download');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['file-content'], { type: 'text/plain' }));
  });
});
