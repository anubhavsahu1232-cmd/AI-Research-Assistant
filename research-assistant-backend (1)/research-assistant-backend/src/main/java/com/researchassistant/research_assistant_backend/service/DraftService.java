package com.researchassistant.research_assistant_backend.service;
import com.researchassistant.research_assistant_backend.dto.request.DraftRequest; import com.researchassistant.research_assistant_backend.dto.response.DraftResponse; import com.researchassistant.research_assistant_backend.entity.Draft; import com.researchassistant.research_assistant_backend.entity.User; import com.researchassistant.research_assistant_backend.repository.DraftRepository; import com.researchassistant.research_assistant_backend.repository.UserRepository; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.stereotype.Service; import java.util.List;
@Service public class DraftService {
 private final DraftRepository drafts; private final UserRepository users;
 public DraftService(DraftRepository d,UserRepository u){drafts=d;users=u;}
 private String email(){return SecurityContextHolder.getContext().getAuthentication().getName();}
 private User currentUser(){return users.findByEmail(email()).orElseThrow(()->new RuntimeException("Logged-in user not found"));}
 public DraftResponse saveDraft(DraftRequest r){Draft d=new Draft();d.setUser(currentUser());d.setTitle(r.getTitle());d.replaceText(r.getTopic(),r.getContent());return convert(drafts.save(d));}
 public List<DraftResponse> getAllDrafts(){return drafts.findAllByUserEmailOrderByIdDesc(email()).stream().map(this::convert).toList();}
 public DraftResponse getDraftById(Long id){return convert(owned(id));}
 public DraftResponse updateDraft(Long id,DraftRequest r){Draft d=owned(id);d.setTitle(r.getTitle());d.replaceText(r.getTopic(),r.getContent());return convert(drafts.save(d));}
 public void deleteDraft(Long id){drafts.delete(owned(id));}
 private Draft owned(Long id){return drafts.findByIdAndUserEmail(id,email()).orElseThrow(()->new RuntimeException("Draft not found"));}
 private DraftResponse convert(Draft d){return new DraftResponse(d.getId(),d.getTitle(),d.readTopic(),d.readContent(),d.getCreatedAt(),d.getUpdatedAt());}
}
