package gymfinder.main;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by jacquiewootton on 10/01/2017.
 */
@Controller
@RequestMapping("/")
public class MainController {

    @RequestMapping
    public ModelAndView showMainPage(ModelAndView mv) {
        mv.setViewName("main/main");
        return mv;
    }
}
