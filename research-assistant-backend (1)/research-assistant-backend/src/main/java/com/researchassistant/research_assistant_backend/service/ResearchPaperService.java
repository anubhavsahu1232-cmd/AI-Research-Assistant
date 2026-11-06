package com.researchassistant.research_assistant_backend.service;
import com.researchassistant.research_assistant_backend.dto.request.ResearchPaperRequest; import com.researchassistant.research_assistant_backend.dto.response.ResearchPaperResponse; import com.researchassistant.research_assistant_backend.entity.ResearchPaper; import com.researchassistant.research_assistant_backend.repository.ResearchPaperRepository; import org.springframework.stereotype.Service; import java.util.List;
@Service public class ResearchPaperService {
 private final ResearchPaperRepository repository; public ResearchPaperService(ResearchPaperRepository r){repository=r;}
 public ResearchPaperResponse save(ResearchPaperRequest r){ResearchPaper p=new ResearchPaper();copy(p,r);return toResponse(repository.save(p));}
 public List<ResearchPaperResponse> getAll(){return repository.findAll().stream().map(this::toResponse).toList();}
 public ResearchPaperResponse getById(Long id){return toResponse(find(id));}
 public ResearchPaperResponse update(Long id,ResearchPaperRequest r){ResearchPaper p=find(id);copy(p,r);return toResponse(repository.save(p));}
 public void delete(Long id){repository.delete(find(id));}
 private ResearchPaper find(Long id){return repository.findById(id).orElseThrow(()->new RuntimeException("Research paper not found"));}
 private void copy(ResearchPaper p,ResearchPaperRequest r){p.setTitle(r.getTitle());p.setAuthors(r.getAuthors());p.setJournal(r.getJournal());p.setPublicationYear(r.getPublicationYear());p.setDoi(r.getDoi());p.setAbstractText(r.getAbstractText());p.setFileUrl(r.getFileUrl());}
 private ResearchPaperResponse toResponse(ResearchPaper p){return new ResearchPaperResponse(p.getId(),p.getTitle(),p.getAuthors(),p.getJournal(),p.getPublicationYear(),p.getDoi(),p.getAbstractText(),p.getFileUrl(),p.getCreatedAt());}
}
